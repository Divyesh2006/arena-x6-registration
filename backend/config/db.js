/**
 * Database Configuration Switcher
 * Uses PostgreSQL in production (Render) for persistence
 * Uses SQLite locally for development
 */

// Check if PostgreSQL DATABASE_URL is provided (Render environment)
if (process.env.DATABASE_URL) {
  console.log('🐘 Using PostgreSQL (persistent storage)');
  module.exports = require('./db-postgres');
} else {
  console.log('📁 Using SQLite (local development)');
  module.exports = require('./db-sqlite');
}
