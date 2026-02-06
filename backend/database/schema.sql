-- ARENA X6 Database Schema
-- MySQL Database Setup for Team Registration System

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS arena_x6 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE arena_x6;

-- Teams Table: Stores all team registrations
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) UNIQUE NOT NULL,
  student1_name VARCHAR(100) NOT NULL,
  student1_regno VARCHAR(50) NOT NULL,
  student2_name VARCHAR(100) NOT NULL,
  student2_regno VARCHAR(50) NOT NULL,
  year VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for faster queries
  INDEX idx_team_name (team_name),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table: Stores admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Display success message
SELECT 'Database schema created successfully!' AS Status;
