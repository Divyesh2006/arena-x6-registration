/**
 * ARENA X6 - Main Server File
 * Team Registration System Backend with MySQL
 * 
 * Velalar College of Engineering and Technology
 * Department of CSE (AI & ML)
 * Event Date: 12/02/2026
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const db = require('./config/db');

// Import routes
const registerRoutes = require('./routes/register');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - Allow file:// protocol and Live Server
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, file://)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:5500',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting for security
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit to 5 registrations per hour per IP
  message: { success: false, message: 'Too many registration attempts. Please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 login attempts per 15 minutes
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/register', registrationLimiter);
app.use('/api/admin/login', loginLimiter);

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ARENA X6 API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ARENA X6 - Team Registration System API',
    version: '1.0.0',
    event: {
      name: 'ARENA X6',
      type: 'Non-Technical Event',
      college: 'Velalar College of Engineering and Technology',
      department: 'CSE (AI & ML)',
      date: '12/02/2026',
      location: 'Thindal, Erode'
    },
    endpoints: {
      registration: '/api/register',
      admin_login: '/api/admin/login',
      admin_teams: '/api/admin/teams',
      admin_stats: '/api/admin/stats',
      admin_export: '/api/admin/export-excel',
      health: '/api/health'
    }
  });
});

// API Routes
app.use('/api/register', registerRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        🏆 ARENA X6 - REGISTRATION SYSTEM API 🏆          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'all origins'}`);
  console.log(`🏫 College: Velalar College of Engineering and Technology`);
  console.log(`🎯 Event: ARENA X6 - Non-Technical Championship`);
  console.log(`📅 Event Date: 12/02/2026\n`);
  console.log('📡 Available Endpoints:');
  console.log(`   • Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   • Registration: http://localhost:${PORT}/api/register`);
  console.log(`   • Admin Login: http://localhost:${PORT}/api/admin/login`);
  console.log(`   • Admin Dashboard: http://localhost:${PORT}/api/admin/teams`);
  console.log(`   • Excel Export: http://localhost:${PORT}/api/admin/export-excel\n`);
  console.log('💡 Press Ctrl+C to stop the server');
  console.log('════════════════════════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await db.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n\n👋 Server shutting down gracefully...');
  await db.end();
  console.log('Database connections closed.');
  process.exit(0);
});

module.exports = app;
