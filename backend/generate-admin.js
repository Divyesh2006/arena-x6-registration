const bcrypt = require('bcryptjs');

// Generate password hash for admin user
const password = 'admin@arena2026';
const hash = bcrypt.hashSync(password, 10);

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  ARENA X6 - Admin User Setup                        ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

console.log('Password Hash Generated Successfully!\n');
console.log('Password Hash:');
console.log(hash);
console.log('\n' + '='.repeat(60));
console.log('\n📋 Copy and run this SQL query in phpMyAdmin:\n');
console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('admin', '${hash}');`);
console.log('\n' + '='.repeat(60));
console.log('\n✅ Default Login Credentials:');
console.log('   Username: admin');
console.log('   Password: admin@arena2026');
console.log('\n');
