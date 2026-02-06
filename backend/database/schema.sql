-- ARENA X6 Database Schema
-- SQLite Database Setup for Team Registration System

-- Teams Table: Stores all team registrations
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_name TEXT UNIQUE NOT NULL,
  student1_name TEXT NOT NULL,
  student1_regno TEXT NOT NULL,
  student2_name TEXT NOT NULL,
  student2_regno TEXT NOT NULL,
  year TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_team_name ON teams(team_name);
CREATE INDEX IF NOT EXISTS idx_created_at ON teams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_year ON teams(year);

-- Admin Users Table: Stores admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Note: SQLite database is automatically created by the application
-- This schema is maintained for reference and manual database creation if needed
