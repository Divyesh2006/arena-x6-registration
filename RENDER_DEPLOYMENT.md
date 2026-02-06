# Render Deployment Guide

## Backend Deployment

### Automatic Setup
The `start.sh` script will automatically:
1. Create the data directory
2. Initialize the database with admin user (if not exists)
3. Start the server

### Render Configuration

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service Settings**
   ```
   Name: arena-x6-registration
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables** (Optional)
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Plan Selection**
   - Free tier works fine for testing
   - Note: Free tier services spin down after 15 minutes of inactivity

### Database Persistence

The SQLite database is stored in `backend/data/arena_x6.db`. On Render's free tier, this will be reset when the service spins down or redeploys. For persistent storage:

**Option 1: Upgrade to Paid Plan** ($7/month minimum)
- Persistent disk storage included
- No spin-down delays

**Option 2: Use External Database** (for production)
- Consider PostgreSQL on Render (free tier available)
- Migrate from SQLite to PostgreSQL

### Default Admin Credentials
```
Username: admin
Password: admin@arena2026
```

**⚠️ IMPORTANT:** Change these credentials immediately after first login!

## Frontend Deployment

The frontend is static HTML/CSS/JS and should be deployed separately:

### GitHub Pages (Recommended - Free)
1. Go to repository Settings → Pages
2. Source: Deploy from branch: main / root
3. Your site will be at: `https://divyesh2006.github.io/arena-x6-registration/`

### Update Frontend Config
The `js/config.js` is already configured to auto-detect:
- Localhost → `http://localhost:3000`
- Production → `https://arena-x6-registration.onrender.com`

## Testing Deployment

1. **Check Backend Health**
   ```
   https://arena-x6-registration.onrender.com/api/health
   ```

2. **Test Registration**
   - Open frontend URL
   - Fill registration form
   - Submit and verify success

3. **Test Admin Panel**
   - Go to `admin-login.html`
   - Login with default credentials
   - Verify teams list and dashboard

## Troubleshooting

### Service Not Starting
- Check Render logs for errors
- Verify all dependencies in `package.json`
- Ensure `start.sh` has execute permissions

### Database Not Persisting
- Free tier resets storage on redeploy
- Consider upgrading to paid plan for persistent disk

### CORS Errors
- Verify frontend domain is in `server.js` CORS allowedOrigins
- Current allowed origins:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `https://divyesh2006.github.io`
  - `https://arena-x6-registration.onrender.com`

### Slow First Request (Free Tier)
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan to prevent spin-down

## Manual Database Reset

If you need to reset the database on Render:

1. Go to Render Dashboard → Your Service → Shell (requires paid plan)
2. Run:
   ```bash
   cd backend
   rm -f data/arena_x6.db
   node generate-admin.js
   ```

Or redeploy the service to trigger automatic initialization.
