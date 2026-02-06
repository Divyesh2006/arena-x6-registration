/**
 * ARENA X6 - Main Server File
 * Team Registration System Backend with SQLite
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
      'https://divyesh2006.github.io',
      'https://arena-x6-registration.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.includes(allowed))) {
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
  max: 1000, // Limit each IP to 1000 requests per window (generous for development)
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 registrations per 15 minutes (generous for testing)
  message: { success: false, message: 'Too many registration attempts. Please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit to 50 login attempts per 15 minutes
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

// Serve static frontend files (HTML, CSS, JS, images)
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ARENA X6 API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/register', registerRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin-dashboard.html'));
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

// Wait for database initialization before starting server
db.ready().then(() => {
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
}).catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down gracefully...');
  console.log('Database saved.');
  process.exit(0);
});

module.exports = app;
