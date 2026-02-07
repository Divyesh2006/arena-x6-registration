/**
 * Registration Routes
 * Handles team registration submission
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { validateRegistration, checkValidation } = require('../middleware/validation');

/**
 * POST /api/register
 * Register a new team for ARENA X6
 */
router.post('/', validateRegistration, checkValidation, async (req, res) => {
  try {
    const {
      team_name,
      student1_name,
      student1_regno,
      student2_name,
      student2_regno,
      year
    } = req.body;

    // Check if team name already exists
    const existingTeams = await db.prepare('SELECT id FROM teams WHERE team_name = ?').get(team_name);

    if (existingTeams) {
      return res.status(400).json({
        success: false,
        message: 'Team name already exists. Please choose a different name.'
      });
    }

    // Check if registration numbers are already registered in another team
    const existingStudent1 = await db.prepare(
      'SELECT team_name FROM teams WHERE student1_regno = ? OR student2_regno = ?'
    ).get(student1_regno, student1_regno);

    if (existingStudent1) {
      return res.status(400).json({
        success: false,
        message: `Registration number ${student1_regno} is already registered in team "${existingStudent1.team_name}". This member is already on another team.`
      });
    }

    const existingStudent2 = await db.prepare(
      'SELECT team_name FROM teams WHERE student1_regno = ? OR student2_regno = ?'
    ).get(student2_regno, student2_regno);

    if (existingStudent2) {
      return res.status(400).json({
        success: false,
        message: `Registration number ${student2_regno} is already registered in team "${existingStudent2.team_name}". This member is already on another team.`
      });
    }

    // Find the smallest available ID (to fill gaps from deleted teams)
    const allIds = await db.prepare('SELECT id FROM teams ORDER BY id ASC').all();
    let nextId = 1;
    
    // Find the first gap in IDs
    for (const row of allIds) {
      if (row.id === nextId) {
        nextId++;
      } else {
        break;
      }
    }

    // Insert new team registration with specific ID
    const result = await db.prepare(
      `INSERT INTO teams
       (id, team_name, student1_name, student1_regno, student2_name, student2_regno, year)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(nextId, team_name, student1_name, student1_regno, student2_name, student2_regno, year);

    // Log successful registration
    console.log(`✅ New team registered: ${team_name} (ID: ${nextId})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to ARENA X6! ',
      team_id: nextId,
      team_name: team_name
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
});

/**
 * GET /api/register/check-team-name/:teamName
 * Check if team name is available (for real-time validation)
 */
router.get('/check-team-name/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;

    const team = await db.prepare('SELECT id FROM teams WHERE team_name = ?').get(teamName);

    res.json({
      success: true,
      available: !team
    });

  } catch (error) {
    console.error('Team name check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking team name availability'
    });
  }
});

module.exports = router;

