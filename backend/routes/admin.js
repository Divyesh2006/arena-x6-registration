/**
 * Admin Routes
 * Handles admin authentication, team management, and Excel export
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin, checkValidation } = require('../middleware/validation');
const { generateExcelReport } = require('../utils/excelGenerator');

/**
 * POST /api/admin/login
 * Admin login authentication
 */
router.post('/login', validateLogin, checkValidation, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin user
    const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login time
    db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log(`✅ Admin login successful: ${username}`);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      admin: {
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

/**
 * GET /api/admin/teams
 * Get all registered teams with optional filtering and pagination
 */
router.get('/teams', authenticateToken, async (req, res) => {
  try {
    const { search, year, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM teams WHERE 1=1';
    const params = [];

    // Add search filter
    if (search) {
      query += ' AND (team_name LIKE ? OR student1_name LIKE ? OR student2_name LIKE ? OR student1_regno LIKE ? OR student2_regno LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    // Add year filter
    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    // Add ordering
    query += ' ORDER BY created_at DESC';

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    // Get teams
    const teams = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM teams WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (team_name LIKE ? OR student1_name LIKE ? OR student2_name LIKE ? OR student1_regno LIKE ? OR student2_regno LIKE ?)';
      const searchParam = `%${search}%`;
      countParams.push(searchParam, searchParam, searchParam, searchParam, searchParam);
    }
    
    if (year) {
      countQuery += ' AND year = ?';
      countParams.push(year);
    }

    const countResult = db.prepare(countQuery).get(...countParams);
    const total = countResult.total;

    res.json({
      success: true,
      teams,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams data'
    });
  }
});

/**
 * GET /api/admin/stats
 * Get registration statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total teams
    const totalResult = db.prepare('SELECT COUNT(*) as total FROM teams').get();
    const total = totalResult.total;

    // Year-wise breakdown
    const yearWise = db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM teams 
      GROUP BY year 
      ORDER BY year
    `).all();

    const yearBreakdown = {
      '1st Year': 0,
      '2nd Year': 0,
      '3rd Year': 0,
      '4th Year': 0
    };

    yearWise.forEach(item => {
      yearBreakdown[item.year] = item.count;
    });

    // Recent registrations (last 5)
    const recent = db.prepare(`
      SELECT team_name, created_at 
      FROM teams 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();    
    // Today's registrations
    const todayResult = db.prepare(`
      SELECT COUNT(*) as count
      FROM teams
      WHERE DATE(created_at) = DATE('now')
    `).get();
    const todayCount = todayResult.count;


    res.json({
      success: true,
      stats: {
        total_teams: total,
        today_registrations: todayCount,
        year_wise: yearBreakdown,
        recent_registrations: recent
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

/**
 * DELETE /api/admin/teams/:id
 * Delete a team by ID
 */
router.delete('/teams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if team exists
    const team = db.prepare('SELECT team_name FROM teams WHERE id = ?').get(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const teamName = team.team_name;

    // Delete team
    db.prepare('DELETE FROM teams WHERE id = ?').run(id);

    console.log(`🗑️ Team deleted: ${teamName} (ID: ${id}) by admin: ${req.admin.username}`);

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });

  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team'
    });
  }
});

/**
 * GET /api/admin/export-excel
 * Export all registrations as Excel file
 */
router.get('/export-excel', authenticateToken, async (req, res) => {
  try {
    // Get all teams ordered by registration date
    const teams = db.prepare(`
      SELECT * FROM teams 
      ORDER BY created_at DESC
    `).all();

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registrations found to export'
      });
    }

    // Generate Excel file
    const excelBuffer = await generateExcelReport(teams);

    // Generate filename with current date
    const date = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
    const filename = `ARENA_X6_Registrations_${date}.xlsx`;

    console.log(`📥 Excel exported: ${teams.length} teams by admin: ${req.admin.username}`);

    // Send Excel file as download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(excelBuffer);

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating Excel file'
    });
  }
});

/**
 * POST /api/admin/logout
 * Logout admin (client should clear token)
 */
router.post('/logout', authenticateToken, (req, res) => {
  console.log(`👋 Admin logout: ${req.admin.username}`);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;



