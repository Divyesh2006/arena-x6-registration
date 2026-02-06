/**
 * MySQL Database Connection Configuration
 * Uses mysql2 with promise support for async/await
 */

const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arena_x6',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your .env file and MySQL server status.');
    process.exit(1);
  }
  console.log('✅ MySQL Database connected successfully!');
  connection.release();
});

module.exports = promisePool;
