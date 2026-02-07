# 🚨 QUICK FIX: Data Not Persisting on Render

## ❌ The Problem
**Render's free tier has EPHEMERAL storage** - your SQLite database file is deleted every time:
- Service restarts
- Service goes to sleep (after 15 min inactivity)
- New deployment happens

**That's why your team registrations disappear!**

---

## ✅ SOLUTION: Switch to PostgreSQL (FREE & Persistent)

I've already prepared your code to support PostgreSQL! Follow these simple steps:

### Step 1: Create Free PostgreSQL Database on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - **Name:** `arena-x6-db`
   - **Database:** `arena_x6`
   - **User:** `arena_admin`
   - **Region:** Same as your web service (e.g., Singapore)
   - **Plan:** **Free** ✅
4. Click **"Create Database"**
5. Wait 1-2 minutes for it to provision

### Step 2: Connect Database to Your Web Service

1. Once database is created, copy the **"Internal Database URL"**
   - It looks like: `postgresql://arena_admin:xxxxx@dpg-xxxxx/arena_x6`
   
2. Go to your **arena-x6-registration** web service
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**
5. Add:
   ```
   Key: DATABASE_URL
   Value: [paste the Internal Database URL here]
   ```
6. Click **"Save Changes"**

### Step 3: Deploy

Your code is already ready! Just git push:

```bash
git add .
git commit -m "Add PostgreSQL support for persistent storage"
git push origin main
```

Render will automatically redeploy in ~2 minutes.

### Step 4: Initialize Admin User

After deployment completes:

**Option A: Use Browser**
Open: `check-admin.html` (already created)
- Click "Initialize Admin User"
- Then click "Test Login"

**Option B: Visit URL**
```
https://arena-x6-registration.onrender.com/api/admin/init-admin
```

---

## 🎯 What Changed?

I've updated your code to automatically detect the environment:

- **Locally (your PC):** Uses SQLite → Fast for development ✅
- **Render (production):** Uses PostgreSQL → Persistent storage ✅

**Files Updated:**
- ✅ `backend/config/db.js` - Now a switcher
- ✅ `backend/config/db-sqlite.js` - Your original SQLite code
- ✅ `backend/config/db-postgres.js` - New PostgreSQL code
- ✅ `backend/package.json` - Added `pg` driver

---

## 📊 Verification

After setup, check if it's working:

```
https://arena-x6-registration.onrender.com/api/diagnostic
```

Should return:
```json
{
  "success": true,
  "database": {
    "connected": true,
    "admin_users": 1,
    "teams": X
  }
}
```

---

## 🔄 Alternative: Quick Test (Temporary)

If you want to test immediately without PostgreSQL:

**Your database WILL still reset, but you can:**

1. Keep `check-admin.html` open
2. After each restart, click "Initialize Admin User"
3. Manually re-register teams for testing

This is **NOT a permanent solution** but works for immediate testing.

---

## ❓ Questions?

**Q: Will I lose existing data?**
A: Yes, but you likely already lost it due to Render resets. PostgreSQL prevents future data loss.

**Q: Is PostgreSQL free?**
A: Yes! Render offers 256MB PostgreSQL free tier - plenty for your registration system.

**Q: Do I need to change my code?**
A: No! I've already prepared everything. Just follow steps above.

**Q: What if I want to keep SQLite?**
A: You'd need Render's paid plan ($7/month) with persistent disk storage.

---

## 🎉 Benefits of PostgreSQL

✅ **Free persistent storage**  
✅ **Data survives restarts**  
✅ **Better for production**  
✅ **Automatic backups by Render**  
✅ **No code changes needed**  
✅ **Scalable as you grow**

---

## 📞 Need Help?

Check the detailed guide: `POSTGRESQL_SETUP.md`

Or test your setup with: `check-admin.html`
