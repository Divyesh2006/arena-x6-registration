/**
 * PostgreSQL Database Connection Configuration
 * For persistent storage on Render
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Initialize database schema
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(100) UNIQUE NOT NULL,
        student1_name VARCHAR(100) NOT NULL,
        student1_regno VARCHAR(20) NOT NULL,
        student2_name VARCHAR(100) NOT NULL,
        student2_regno VARCHAR(20) NOT NULL,
        year VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_team_name ON teams(team_name);
      CREATE INDEX IF NOT EXISTS idx_created_at ON teams(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_year ON teams(year);
      
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);
    
    client.release();
    console.log('✅ PostgreSQL Database initialized successfully!');
    console.log(`📁 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local'}`);
    
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    throw err;
  }
}

// Wrapper functions for compatibility with existing code
const dbWrapper = {
  prepare: (query) => {
    return {
      get: async (...params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(query, params);
          return result.rows[0] || null;
        } finally {
          client.release();
        }
      },
      all: async (...params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(query, params);
          return result.rows;
        } finally {
          client.release();
        }
      },
      run: async (...params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(query, params);
          return { changes: result.rowCount };
        } finally {
          client.release();
        }
      }
    };
  },
  exec: async (query) => {
    const client = await pool.connect();
    try {
      await client.query(query);
    } finally {
      client.release();
    }
  },
  ready: initializeDatabase,
  pool // Export pool for direct queries if needed
};

// Test connection
pool.on('connect', () => {
  console.log('🔌 PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL error:', err);
});

module.exports = dbWrapper;
