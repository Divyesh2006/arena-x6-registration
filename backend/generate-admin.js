const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database path
const dbPath = path.join(dbDir, 'arena_x6.db');

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  ARENA X6 - Admin User Setup                        ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

async function setupAdmin() {
  try {
    const SQL = await initSqlJs();
    let db;
    
    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
      const filebuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(filebuffer);
      console.log('📁 Database loaded from:', dbPath);
    } else {
      db = new SQL.Database();
      console.log('📁 New database will be created at:', dbPath);
    }
    
    // Create admin_users table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      );
    `);
    
    // Generate password hash
    const password = 'admin@arena2026';
    const hash = bcrypt.hashSync(password, 10);
    
    // Check if admin already exists
    const stmt = db.prepare('SELECT id FROM admin_users WHERE username = ?');
    stmt.bind(['admin']);
    const existingAdmin = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    
    if (existingAdmin) {
      // Update existing admin password
      const updateStmt = db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?');
      updateStmt.bind([hash, 'admin']);
      updateStmt.step();
      updateStmt.free();
      console.log('✅ Admin password updated successfully!\n');
    } else {
      // Insert new admin user
      const insertStmt = db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
      insertStmt.bind(['admin', hash]);
      insertStmt.step();
      insertStmt.free();
      console.log('✅ Admin user created successfully!\n');
    }
    
    // Save database to file
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    
    console.log('📋 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin@arena2026');
    console.log('\n' + '='.repeat(60));
    console.log(`\n📁 Database saved to: ${dbPath}\n`);
    
    db.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
