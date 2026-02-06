/**
 * SQLite Database Connection Configuration
 * Uses sql.js for SQLite database operations
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database file path
const dbPath = process.env.DB_PATH || path.join(dbDir, 'arena_x6.db');

let db;
let SQL;
let isInitialized = false;

// Initialize database
async function initializeDatabase() {
  try {
    SQL = await initSqlJs();
    
    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
      const filebuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(filebuffer);
      console.log('✅ SQLite Database loaded successfully!');
    } else {
      db = new SQL.Database();
      console.log('✅ SQLite Database created successfully!');
    }
    
    console.log(`📁 Database location: ${dbPath}`);
    
    // Create schema
    createSchema();
    
    // Save database to file
    saveDatabase();
    
    isInitialized = true;
    
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
}

// Create database schema
function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_name TEXT UNIQUE NOT NULL,
      student1_name TEXT NOT NULL,
      student1_regno TEXT NOT NULL,
      student2_name TEXT NOT NULL,
      student2_regno TEXT NOT NULL,
      year TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_team_name ON teams(team_name);
    CREATE INDEX IF NOT EXISTS idx_created_at ON teams(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_year ON teams(year);
    
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Wrapper functions for easier query execution
const dbWrapper = {
  prepare: (query) => {
    if (!isInitialized) {
      throw new Error('Database not initialized. Call ready() first.');
    }
    return {
      get: (...params) => {
        const stmt = db.prepare(query);
        stmt.bind(params);
        const result = stmt.step() ? stmt.getAsObject() : null;
        stmt.free();
        saveDatabase();
        return result;
      },
      all: (...params) => {
        const stmt = db.prepare(query);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        saveDatabase();
        return results;
      },
      run: (...params) => {
        const stmt = db.prepare(query);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        saveDatabase();
        return { changes: db.getRowsModified() };
      }
    };
  },
  exec: (query) => {
    if (!isInitialized) {
      throw new Error('Database not initialized. Call ready() first.');
    }
    db.exec(query);
    saveDatabase();
  },
  ready: initializeDatabase
};

module.exports = dbWrapper;
