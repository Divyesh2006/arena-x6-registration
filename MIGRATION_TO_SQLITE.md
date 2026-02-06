# Migration from MySQL to SQLite

## Overview
The ARENA X6 Registration System has been successfully migrated from MySQL to SQLite using `sql.js`.

## What Changed

### 1. **Database Package**
- **Before:** `mysql2` (requires MySQL server)
- **After:** `sql.js` (pure JavaScript SQLite, no server needed)

### 2. **Database Configuration** ([backend/config/db.js](backend/config/db.js))
- SQLite database is now stored as a file: `backend/data/arena_x6.db`
- No need for MySQL server, host, port, username, or password
- Database is automatically created on first run
- Data persists to disk after every operation

### 3. **Query Syntax Changes**
All MySQL queries have been converted to SQLite-compatible syntax:

**MySQL → SQLite changes:**
- `CURDATE()` → `DATE('now')`
- `CURRENT_TIMESTAMP` remains the same
- `AUTO_INCREMENT` → `AUTOINCREMENT`
- `VARCHAR()` → `TEXT`
- `INT` → `INTEGER`
- Array destructuring `[results]` → Direct results
- `.query()` → `.prepare().get()` or `.prepare().all()`

### 4. **Files Modified**

#### Updated Files:
- ✅ `backend/package.json` - Replaced mysql2 with sql.js
- ✅ `backend/config/db.js` - Complete rewrite for sql.js
- ✅ `backend/database/schema.sql` - SQLite syntax
- ✅ `backend/routes/register.js` - SQLite queries
- ✅ `backend/routes/admin.js` - SQLite queries
- ✅ `backend/generate-admin.js` - SQLite implementation
- ✅ `backend/server.js` - Updated description and startup

### 5. **Environment Variables**
No longer needed (but kept for compatibility):
- ~~`DB_HOST`~~
- ~~`DB_PORT`~~
- ~~`DB_USER`~~
- ~~`DB_PASSWORD`~~
- ~~`DB_NAME`~~

Optional new variable:
- `DB_PATH` - Custom database file path (defaults to `backend/data/arena_x6.db`)

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Admin User
```bash
node generate-admin.js
```

This will:
- Create the database file at `backend/data/arena_x6.db`
- Create the `admin_users` table
- Insert admin user with credentials:
  - **Username:** admin
  - **Password:** admin@arena2026

### 3. Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Benefits of SQLite Migration

### ✅ Advantages:
1. **No Server Required** - No need to install/run MySQL server
2. **Zero Configuration** - Works out of the box
3. **Portable** - Single file database, easy to backup
4. **Lightweight** - No memory overhead from database server
5. **Perfect for Small/Medium Apps** - Ideal for event registration systems
6. **Cross-Platform** - Pure JavaScript, works everywhere Node.js runs
7. **Easy Deployment** - No database server setup on production

### ⚠️ Considerations:
1. **Concurrency** - SQLite handles concurrent reads well, writes are serialized
2. **File-based** - Database is a single file in `backend/data/`
3. **Backup** - Simply copy the `arena_x6.db` file

## Database Location

The SQLite database is stored at:
```
backend/data/arena_x6.db
```

To **backup** the database:
```bash
# Simple file copy
cp backend/data/arena_x6.db backend/data/arena_x6_backup.db
```

To **reset** the database:
```bash
# Delete the database file (it will be recreated on next startup)
rm backend/data/arena_x6.db

# Then recreate admin user
node backend/generate-admin.js
```

## Testing the Migration

1. **Start the server:**
   ```bash
   cd backend
   npm start
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Test admin login:**
   - Open `admin-login.html` in browser
   - Login with: admin / admin@arena2026

4. **Test registration:**
   - Open `index.html` in browser
   - Fill and submit the registration form

## API Endpoints (Unchanged)

All API endpoints remain the same:
- `GET /api/health` - Health check
- `POST /api/register` - Team registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/teams` - Get all teams (requires auth)
- `GET /api/admin/stats` - Get statistics (requires auth)
- `DELETE /api/admin/teams/:id` - Delete team (requires auth)
- `GET /api/admin/export-excel` - Export to Excel (requires auth)

## Troubleshooting

### Database file not found
The database is automatically created on first run. If you see errors:
```bash
node backend/generate-admin.js
```

### Permission errors
Ensure the `backend/data/` directory is writable:
```bash
mkdir -p backend/data
chmod 755 backend/data
```

### Old MySQL references
All MySQL code has been removed. If you see MySQL errors, ensure you've run:
```bash
npm install
```

## Migration Summary

✅ **Completed:**
- MySQL → SQLite conversion
- All routes updated
- Admin generation script updated
- Database schema converted
- Dependencies updated
- Server startup logic updated

🎉 **Result:**
A simpler, more portable registration system with zero database server dependencies!

## Need MySQL Again?

If you need to migrate back to MySQL, the GitHub repository has the original MySQL version:
- https://github.com/Divyesh2006/arena-x6-registration

---

**Questions or Issues?**
The system is ready to use with SQLite. Just run `npm install` and `node generate-admin.js` to get started!
