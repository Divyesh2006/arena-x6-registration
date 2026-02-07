/**
 * Data Migration Script
 * Migrates existing SQLite data to PostgreSQL
 * 
 * Usage: node migrate-to-postgres.js
 */

const initSqlJs = require('sql.js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Ask user for input
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function migrateToPSQL() {
  try {
    log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
    log('║     ARENA X6 - DATA MIGRATION TO POSTGRESQL            ║', 'bright');
    log('╚══════════════════════════════════════════════════════════╝\n', 'bright');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      log('❌ ERROR: DATABASE_URL environment variable not set!', 'red');
      log('\nTo use this migration tool:', 'yellow');
      log('1. Get your PostgreSQL Internal Database URL from Render', 'yellow');
      log('2. Create a .env file in the backend folder', 'yellow');
      log('3. Add this line: DATABASE_URL=your_postgres_url_here\n', 'yellow');
      
      const dbUrl = await askQuestion('Or paste your PostgreSQL DATABASE_URL now: ');
      
      if (!dbUrl || !dbUrl.startsWith('postgresql://')) {
        log('❌ Invalid DATABASE_URL. Exiting.', 'red');
        process.exit(1);
      }
      
      process.env.DATABASE_URL = dbUrl.trim();
    }

    log('🔍 Step 1: Loading SQLite Database...', 'cyan');
    
    // Load SQLite database
    const dbPath = path.join(__dirname, 'data', 'arena_x6.db');
    
    if (!fs.existsSync(dbPath)) {
      log(`❌ SQLite database not found at: ${dbPath}`, 'red');
      log('Nothing to migrate!', 'yellow');
      process.exit(1);
    }

    const SQL = await initSqlJs();
    const filebuffer = fs.readFileSync(dbPath);
    const sqliteDb = new SQL.Database(filebuffer);
    log('✅ SQLite database loaded', 'green');

    // Get data from SQLite
    log('\n📊 Step 2: Reading data from SQLite...', 'cyan');
    
    const teamsStmt = sqliteDb.prepare('SELECT * FROM teams');
    const teams = [];
    while (teamsStmt.step()) {
      teams.push(teamsStmt.getAsObject());
    }
    teamsStmt.free();

    const adminsStmt = sqliteDb.prepare('SELECT * FROM admin_users');
    const admins = [];
    while (adminsStmt.step()) {
      admins.push(adminsStmt.getAsObject());
    }
    adminsStmt.free();

    log(`   📋 Found ${teams.length} team(s)`, 'blue');
    log(`   👤 Found ${admins.length} admin user(s)`, 'blue');

    if (teams.length === 0 && admins.length === 0) {
      log('\n⚠️  No data to migrate!', 'yellow');
      process.exit(0);
    }

    // Show preview of data
    log('\n📄 Preview of teams to migrate:', 'cyan');
    teams.slice(0, 5).forEach((team, i) => {
      log(`   ${i + 1}. ${team.team_name} (${team.year}) - ${team.student1_name} & ${team.student2_name}`, 'blue');
    });
    if (teams.length > 5) {
      log(`   ... and ${teams.length - 5} more teams`, 'blue');
    }

    // Confirm migration
    log('\n⚠️  This will add all data to your PostgreSQL database.', 'yellow');
    const confirm = await askQuestion('Continue? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      log('❌ Migration cancelled.', 'red');
      process.exit(0);
    }

    // Connect to PostgreSQL
    log('\n🐘 Step 3: Connecting to PostgreSQL...', 'cyan');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    log('✅ Connected to PostgreSQL', 'green');

    // Create tables if they don't exist
    log('\n🏗️  Step 4: Ensuring tables exist...', 'cyan');
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
      
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);
    log('✅ Tables verified', 'green');

    // Migrate admin users
    log('\n👤 Step 5: Migrating admin users...', 'cyan');
    let adminsMigrated = 0;
    let adminsSkipped = 0;

    for (const admin of admins) {
      try {
        await client.query(
          `INSERT INTO admin_users (username, password_hash, created_at, last_login)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (username) DO NOTHING`,
          [admin.username, admin.password_hash, admin.created_at, admin.last_login]
        );
        adminsMigrated++;
        log(`   ✅ Migrated admin: ${admin.username}`, 'green');
      } catch (err) {
        adminsSkipped++;
        log(`   ⚠️  Skipped admin: ${admin.username} (already exists)`, 'yellow');
      }
    }

    // Migrate teams
    log('\n📋 Step 6: Migrating teams...', 'cyan');
    let teamsMigrated = 0;
    let teamsSkipped = 0;
    let teamsFailed = 0;

    for (const team of teams) {
      try {
        const result = await client.query(
          `INSERT INTO teams (team_name, student1_name, student1_regno, student2_name, student2_regno, year, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (team_name) DO NOTHING
           RETURNING id`,
          [
            team.team_name,
            team.student1_name,
            team.student1_regno,
            team.student2_name,
            team.student2_regno,
            team.year,
            team.created_at
          ]
        );

        if (result.rowCount > 0) {
          teamsMigrated++;
          log(`   ✅ ${teamsMigrated}/${teams.length} - ${team.team_name}`, 'green');
        } else {
          teamsSkipped++;
          log(`   ⚠️  ${teamsMigrated + teamsSkipped}/${teams.length} - ${team.team_name} (already exists)`, 'yellow');
        }
      } catch (err) {
        teamsFailed++;
        log(`   ❌ Failed: ${team.team_name} - ${err.message}`, 'red');
      }
    }

    client.release();
    await pool.end();

    // Summary
    log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
    log('║              MIGRATION COMPLETE                          ║', 'bright');
    log('╚══════════════════════════════════════════════════════════╝\n', 'bright');

    log('📊 Summary:', 'cyan');
    log(`   Admin Users: ${adminsMigrated} migrated, ${adminsSkipped} skipped`, 'blue');
    log(`   Teams: ${teamsMigrated} migrated, ${teamsSkipped} skipped, ${teamsFailed} failed`, 'blue');
    log(`\n✅ Total: ${adminsMigrated + teamsMigrated} records migrated successfully!`, 'green');

    log('\n🎉 Your data is now in PostgreSQL!', 'green');
    log('Visit your admin dashboard to verify: https://arena-x6-registration.onrender.com/admin-login\n', 'cyan');

  } catch (error) {
    log(`\n❌ Migration failed: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run migration
migrateToPSQL();
