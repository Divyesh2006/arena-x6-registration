# SQLite Quick Start Guide

## ✅ Migration Complete!

Your ARENA X6 Registration System has been successfully converted from MySQL to SQLite.

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Admin User
```bash
node generate-admin.js
```

**Default Credentials:**
- Username: `admin`
- Password: `admin@arena2026`

### 3. Start the Server
```bash
npm start
```

The server will start at: **http://localhost:3000**

## 📁 Database Location

Your SQLite database is stored at:
```
backend/data/arena_x6.db
```

## 🧪 Test the System

1. **Open the registration form:**
   - Open `index.html` in your browser
   - Fill out and submit a team registration

2. **Access admin dashboard:**
   - Open `admin-login.html` in your browser
   - Login with: `admin` / `admin@arena2026`
   - View, manage, and export registrations

## 📊 API Endpoints

All endpoints remain unchanged:

- `GET /api/health` - Check if API is running
- `POST /api/register` - Register a new team
- `POST /api/admin/login` - Admin login
- `GET /api/admin/teams` - View all teams (requires auth)
- `GET /api/admin/stats` - Get statistics (requires auth)
- `DELETE /api/admin/teams/:id` - Delete a team (requires auth)
- `GET /api/admin/export-excel` - Export to Excel (requires auth)

## 🎉 Key Benefits

✅ **No MySQL Server Required** - Works out of the box  
✅ **Zero Configuration** - Just install and run  
✅ **Single File Database** - Easy to backup and deploy  
✅ **Portable** - Works on any platform with Node.js  
✅ **Lightweight** - No database server overhead  

## 🔧 Common Tasks

### Backup Database
```bash
cp backend/data/arena_x6.db backend/data/arena_x6_backup.db
```

### Reset Database
```bash
rm backend/data/arena_x6.db
node backend/generate-admin.js
```

### View Database
You can use any SQLite viewer/browser or:
```bash
npm install -g sqlite3
sqlite3 backend/data/arena_x6.db
```

## 📝 What Changed?

- ✅ `mysql2` → `sql.js` (pure JavaScript SQLite)
- ✅ All MySQL queries converted to SQLite
- ✅ Database stored as a file (no server needed)
- ✅ Automatic database creation on first run
- ✅ All routes and features working perfectly

## 🆘 Need Help?

**Database not found?**
```bash
node backend/generate-admin.js
```

**Port already in use?**
Edit `backend/.env` and change `PORT=3000` to another port

**Start with auto-reload (development):**
```bash
npm run dev
```

---

**Ready to use! 🎊**

For detailed migration information, see: [MIGRATION_TO_SQLITE.md](MIGRATION_TO_SQLITE.md)
