# PostgreSQL Setup for Render (FREE Persistent Storage)

## Why PostgreSQL?
Render's free tier wipes SQLite files on every restart. PostgreSQL provides **FREE persistent storage** that survives restarts.

## Step-by-Step Setup

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   ```
   Name: arena-x6-db
   Database: arena_x6
   User: arena_admin
   Region: Same as your web service
   PostgreSQL Version: 16 (latest)
   ```
4. Click **"Create Database"**
5. Wait for it to provision (1-2 minutes)

### 2. Get Database URL

After creation, you'll see:
- **Internal Database URL** (use this for Render services)
- **External Database URL** (use for local testing)

Copy the **Internal Database URL** - it looks like:
```
postgresql://arena_admin:password@dpg-xxxxx/arena_x6
```

### 3. Configure Your Web Service

1. Go to your **arena-x6-registration** web service
2. Click **"Environment"** tab
3. Add environment variable:
   ```
   Key: DATABASE_URL
   Value: [paste the Internal Database URL]
   ```
4. Click **"Save Changes"**

### 4. Update Code to Use PostgreSQL

#### Install PostgreSQL Driver:
```bash
cd backend
npm install pg
```

#### Update `backend/config/db.js`:
Replace the entire file content with:
```javascript
// Use PostgreSQL if DATABASE_URL exists, otherwise use SQLite
if (process.env.DATABASE_URL) {
  module.exports = require('./db-postgres');
} else {
  module.exports = require('./db-sqlite');
}
```

#### Rename current `db.js` to `db-sqlite.js`:
```bash
mv backend/config/db.js backend/config/db-sqlite.js
```

Then create the new `db.js` with the switch logic above.

### 5. Update Routes to Use Async/Await

Since PostgreSQL is async, update your routes. The changes needed:

**In `backend/routes/register.js` and `backend/routes/admin.js`:**
- Change `.get()` to `await .get()`
- Change `.all()` to `await .all()`
- Change `.run()` to `await .run()`

### 6. Deploy

```bash
git add .
git commit -m "Add PostgreSQL support for persistent storage"
git push
```

Render will automatically redeploy with PostgreSQL!

### 7. Initialize Admin User

After deployment, visit:
```
https://arena-x6-registration.onrender.com/api/admin/init-admin
```

Use the diagnostic tool at: `check-admin.html`

## Testing Locally with PostgreSQL

1. Install PostgreSQL locally or use the External Database URL
2. Add to `.env`:
   ```
   DATABASE_URL=postgresql://username:password@host/database
   ```
3. Run: `npm start`

## Benefits

✅ **Persistent Storage** - Data survives restarts
✅ **FREE** - Render's PostgreSQL free tier
✅ **Scalable** - Easier to upgrade if needed
✅ **Better for Production** - Industry standard
✅ **Automatic Backups** - Render handles this

## Verification

Check your database has data:
```
https://arena-x6-registration.onrender.com/api/diagnostic
```

You should see:
```json
{
  "success": true,
  "database": {
    "connected": true,
    "admin_users": 1,
    "teams": [number of registered teams]
  }
}
```

## Troubleshooting

**Connection errors?**
- Verify DATABASE_URL is set correctly
- Check PostgreSQL instance is running
- Ensure web service and database are in same region

**Still losing data?**
- Confirm you're using Internal Database URL
- Check Render logs for errors
- Verify `pg` package is installed

**Admin user not persisting?**
- Run `/api/admin/init-admin` after each deployment
- Or add admin creation to startup script
