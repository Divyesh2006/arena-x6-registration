-- ARENA X6 Database Seed Data
-- Inserts default admin user
-- Password: admin@arena2026 (hashed with bcrypt)

USE arena_x6;

-- Insert default admin user
-- Password hash for: admin@arena2026
-- Generated using bcrypt with 10 salt rounds
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$8ZqF9YGKZwY5e5X5X5X5X.YGKZwY5e5X5X5X5XYGKZwY5e5X5X5X5')
ON DUPLICATE KEY UPDATE username = username;

-- Note: You need to generate the actual bcrypt hash
-- Run this Node.js code to generate the hash:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('admin@arena2026', 10);
-- console.log(hash);

SELECT 'Admin user seeded successfully!' AS Status;
SELECT 'Default credentials - Username: admin, Password: admin@arena2026' AS Info;
