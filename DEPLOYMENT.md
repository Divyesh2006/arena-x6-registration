# Deployment Guide for Arena X6 Registration System

## Overview
This guide covers deploying the Arena X6 Registration System to Render (backend) and GitHub Pages (frontend).

## Prerequisites
- GitHub account
- Render account (free tier works)
- Git installed locally

## Option 1: Deploy Using render.yaml (Recommended)

### Step 1: Push render.yaml to GitHub
```bash
git add render.yaml backend/start.sh backend/.env.example
git commit -m "Add Render deployment configuration"
git push
```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `Divyesh2006/arena-x6-registration`
4. Render will automatically detect `render.yaml`
5. Click **"Apply"** to deploy both services

### Step 3: Configure Persistent Storage (Important!)
1. Go to your backend service dashboard
2. Navigate to **"Disks"** tab
3. Verify the disk is attached at `/opt/render/project/src/backend/data`
4. This ensures your SQLite database persists across deployments

### Step 4: Update Frontend Configuration
The frontend will automatically use the correct API URL based on the environment detection in `js/config.js`.

---

## Option 2: Manual Deployment

### Backend Deployment (Render)

#### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `Divyesh2006/arena-x6-registration`
4. Configure:
   - **Name:** `arena-x6-registration`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `chmod +x start.sh && ./start.sh`
   - **Plan:** Free

#### Step 2: Add Environment Variables
In the "Environment" tab, add:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=<generate-a-random-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@arena2026
```

#### Step 3: Add Persistent Disk
1. Go to "Disks" tab
2. Click **"Add Disk"**
3. Configure:
   - **Name:** `arena-data`
   - **Mount Path:** `/opt/render/project/src/backend/data`
   - **Size:** 1 GB
4. Click **"Save"**

#### Step 4: Deploy
Click **"Create Web Service"** and wait for deployment (2-5 minutes).

### Frontend Deployment (GitHub Pages)

#### Option A: Deploy from Repository Root
1. Go to repository **Settings** → **Pages**
2. Source: **"Deploy from a branch"**
3. Branch: `main` / `(root)`
4. Click **"Save"**
5. Access at: `https://divyesh2006.github.io/arena-x6-registration/`

#### Option B: Deploy using Render Static Site
The `render.yaml` includes a static site configuration that will automatically deploy your frontend.

---

## Post-Deployment Steps

### 1. Verify Backend Health
Visit: `https://arena-x6-registration.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T..."
}
```

### 2. Test Admin Login
1. Go to your frontend URL
2. Navigate to Admin Login
3. Use credentials:
   - Username: `admin`
   - Password: `admin@arena2026`

### 3. Test Registration
1. Fill out the registration form
2. Submit a test team
3. Verify in admin dashboard

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Server port | No | `3000` (Render uses `10000`) |
| `JWT_SECRET` | Secret for JWT tokens | Yes | - |
| `ADMIN_USERNAME` | Initial admin username | No | `admin` |
| `ADMIN_PASSWORD` | Initial admin password | No | `admin@arena2026` |
| `DB_PATH` | SQLite database path | No | `./data/arena_x6.db` |

---

## Troubleshooting

### Backend won't start
**Check logs:** Render Dashboard → Your Service → Logs tab

Common issues:
- Missing environment variables
- Database initialization failed
- Port conflict (ensure PORT is not set or set to 10000)

### Frontend can't connect to backend
1. Check `js/config.js` - should auto-detect production
2. Verify CORS settings in `backend/server.js`
3. Check browser console for errors
4. Ensure backend URL in config matches your Render URL

### Database resets on deployment
- **Cause:** No persistent disk attached
- **Solution:** Add disk at mount path `/opt/render/project/src/backend/data`

### Admin login fails after deployment
- **Cause:** Database created but admin not initialized
- **Solution:** Check startup logs, restart service to re-run `start.sh`

### Rate limit errors during testing
- **Cause:** Too many requests in short time
- **Solution:** Wait 15 minutes or adjust limits in `backend/server.js`

---

## Local Development

### Setup
```bash
# Install dependencies
cd backend
npm install

# Create admin user
node generate-admin.js

# Start server
node server.js
```

### Access
- Frontend: Open `index.html` in browser (or use Live Server)
- Backend: `http://localhost:3000`
- Admin: Open `admin-login.html` in browser

---

## Database Backup

### Backup SQLite Database
```bash
# Download from Render (requires shell access on paid plan)
# Or use disk snapshot feature in Render dashboard

# Local backup
cp backend/data/arena_x6.db backend/data/arena_x6.backup.db
```

### Restore Database
```bash
cp backend/data/arena_x6.backup.db backend/data/arena_x6.db
# Restart service
```

---

## Security Recommendations

1. **Change default admin password** after first login
2. **Generate strong JWT_SECRET** (use online generator)
3. **Enable HTTPS only** in production (Render provides this)
4. **Regular backups** of SQLite database
5. **Monitor rate limits** and adjust if needed
6. **Update dependencies** regularly: `npm audit fix`

---

## Monitoring

### Health Check Endpoint
- URL: `https://arena-x6-registration.onrender.com/api/health`
- Method: `GET`
- Success: `200 OK` with JSON response

### Render Dashboard
- View logs in real-time
- Monitor memory/CPU usage
- Check deployment history
- View environment variables

---

## Support

For issues or questions:
1. Check logs in Render dashboard
2. Review browser console for frontend errors
3. Verify environment variables
4. Ensure database disk is attached

---

## Quick Commands Reference

```bash
# Push to GitHub (triggers Render deployment)
git add .
git commit -m "Your message"
git push

# Local development
cd backend
npm install
node generate-admin.js
node server.js

# Test API locally
curl http://localhost:3000/api/health

# Make start.sh executable (if needed)
chmod +x backend/start.sh
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
└────────────┬────────────────────────────────┬───────────┘
             │                                │
             │ HTTPS                          │ HTTPS
             │                                │
    ┌────────▼─────────┐            ┌────────▼──────────┐
    │  GitHub Pages    │            │  Render Web       │
    │  (Frontend)      │            │  Service          │
    │  - HTML/CSS/JS   │◄───────────┤  (Backend)        │
    │  - Static Files  │   CORS     │  - Express API    │
    └──────────────────┘            │  - Node.js        │
                                    │  - JWT Auth       │
                                    └─────────┬─────────┘
                                              │
                                              │ File I/O
                                              │
                                    ┌─────────▼─────────┐
                                    │  Persistent Disk  │
                                    │  - SQLite DB      │
                                    │  - arena_x6.db    │
                                    └───────────────────┘
```

---

## Deployment Checklist

- [ ] Push all code to GitHub
- [ ] Create Render web service
- [ ] Add environment variables
- [ ] Attach persistent disk
- [ ] Wait for deployment to complete
- [ ] Test health endpoint
- [ ] Setup GitHub Pages
- [ ] Test frontend loads
- [ ] Test registration flow
- [ ] Test admin login
- [ ] Change default admin password
- [ ] Bookmark admin panel URL

---

*Last Updated: February 6, 2026*
