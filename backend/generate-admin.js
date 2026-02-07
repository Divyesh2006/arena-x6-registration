const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  ARENA X6 - Admin User Setup                        ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

async function setupAdmin() {
  try {
    // Wait for database to be ready
    await db.ready();
    
    console.log('📁 Database initialized');
    
    // Generate password hash
    const password = 'admin@arena2026';
    const hash = bcrypt.hashSync(password, 10);
    
    // Check if admin already exists
    const existingAdmin = await db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
    
    if (existingAdmin) {
      // Update existing admin password
      await db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, 'admin');
      console.log('✅ Admin password updated successfully!\n');
    } else {
      // Insert new admin user
      await db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
      console.log('✅ Admin user created successfully!\n');
    }
    
    // Verify admin was created
    const verified = await db.prepare('SELECT username FROM admin_users WHERE username = ?').get('admin');
    
    if (verified) {
      console.log('✅ Admin verification successful!');
    }
    
    console.log('📋 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin@arena2026');
    console.log('\n' + '='.repeat(60) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

setupAdmin();
