# Render Deployment Troubleshooting Guide

## 401 Error on Admin Login

If you're getting a 401 error when trying to login on Render, follow these steps:

### Step 1: Check if Admin User Exists

Visit your Render backend URL with the diagnostic endpoint:
```
https://your-app-name.onrender.com/api/diagnostic
```

This will show:
- Number of admin users
- Number of teams registered
- Database connection status

### Step 2: Check Admin Setup

Visit:
```
https://your-app-name.onrender.com/api/admin/check-setup
```

This will tell you if the admin user exists and when it was created.

### Step 3: Initialize Admin User (If Needed)

If the admin user doesn't exist, you can create it by making a POST request:

**Using curl:**
```bash
curl -X POST https://your-app-name.onrender.com/api/admin/init-admin
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri https://your-app-name.onrender.com/api/admin/init-admin -Method POST
```

**Using browser console (open your site and press F12):**
```javascript
fetch('https://your-app-name.onrender.com/api/admin/init-admin', {
  method: 'POST'
}).then(r => r.json()).then(console.log)
```

### Step 4: Verify Startup Logs

In Render Dashboard:
1. Go to your service
2. Click on "Logs" tab
3. Look for these messages:
   - `✅ Admin user created successfully!` or `✅ Admin password updated successfully!`
   - `✅ SQLite Database loaded successfully!`
   - `🚀 Server running on: http://localhost:3000`

### Step 5: Test Login

Default credentials:
```
Username: admin
Password: admin@arena2026
```

## Common Issues & Solutions

### Issue: Database Not Persisting

**Problem:** Admin user exists after deployment but disappears later.

**Cause:** Render's free tier doesn't have persistent disk storage.

**Solutions:**
1. **Upgrade to Paid Plan** ($7/month)
   - Go to Render Dashboard → Your Service → Settings
   - Under "Plan", upgrade to Starter or higher
   - This provides persistent disk storage

2. **Redeploy Trigger**
   - After any redeploy, the database resets on free tier
   - Run the init-admin endpoint again after each deploy

### Issue: CORS Errors

**Problem:** Frontend can't connect to backend.

**Check:**
```
Network tab in browser DevTools (F12)
Look for red CORS errors
```

**Solution:**
Add your frontend URL to environment variables on Render:
```
FRONTEND_URL=https://your-github-pages-url.github.io
```

Then redeploy.

### Issue: 500 Internal Server Error

**Check logs for:**
- Database connection errors
- Missing dependencies
- Environment variable issues

**Common fixes:**
1. Ensure all dependencies are in `package.json`
2. Check Node.js version compatibility (use Node 18+)
3. Verify build command: `npm install`
4. Verify start command: `npm start`

### Issue: Service Spinning Down (Free Tier)

**Problem:** First request takes 30-60 seconds.

**Cause:** Free tier services spin down after 15 minutes of inactivity.

**Solutions:**
1. Upgrade to paid plan (no spin down)
2. Use uptime monitoring service (like UptimeRobot) to ping your API every 5 minutes
3. Accept the delay for free tier

## Manual Database Reset

If you need to completely reset the database:

1. In Render Dashboard → Shell (tab next to Logs)
2. Run:
```bash
cd backend
rm -rf data/arena_x6.db
node generate-admin.js
```

3. Restart service (not needed, auto-restarts)

## Checking from Local Machine

Test your deployed backend:

```bash
# Health Check
curl https://your-app-name.onrender.com/api/health

# Diagnostic
curl https://your-app-name.onrender.com/api/diagnostic

# Admin Check
curl https://your-app-name.onrender.com/api/admin/check-setup

# Initialize Admin
curl -X POST https://your-app-name.onrender.com/api/admin/init-admin

# Test Login
curl -X POST https://your-app-name.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@arena2026"}'
```

## Contact & Support

If issues persist after trying these steps:

1. Check Render community forums
2. Review application logs thoroughly
3. Ensure your GitHub repository is up to date
4. Try manual redeploy from Render Dashboard

## Quick Diagnostic Checklist

- [ ] Backend URL accessible (health endpoint responds)
- [ ] Diagnostic endpoint shows admin_users > 0
- [ ] No CORS errors in browser console
- [ ] Correct credentials: admin / admin@arena2026
- [ ] Database file exists (check logs for file path)
- [ ] Start script executed successfully (check deployment logs)

---

**Remember:** On Render free tier, database resets on every redeploy. Run the init-admin endpoint after each deployment if needed.
