# 🏆 ARENA X6 - Team Registration System

A premium, production-ready team registration system with MySQL database, admin dashboard, and Excel export functionality for Velalar College of Engineering and Technology.

![ARENA X6](https://img.shields.io/badge/Event-ARENA%20X6-gold)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Status](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)

## 📋 Project Overview

**Event**: ARENA X6 - Non-Technical Championship  
**College**: Velalar College of Engineering and Technology, Thindal, Erode  
**Department**: CSE (Artificial Intelligence and Machine Learning)  
**Event Date**: 12th February, 2026  

## ✨ Features

### 🎯 Registration Form
- **Premium Dark Theme** with animated background (Particles.js)
- **Real-time validation** with instant feedback
- **Duplicate team name check** before submission
- **Auto-capitalize names** and **auto-uppercase** registration numbers
- **Success animation** with confetti celebration
- **Mobile responsive** design

### 👨‍💼 Admin Dashboard
- **Secure authentication** with JWT tokens
- **View all registrations** in a sortable, searchable table
- **Filter by academic year**
- **Delete teams** with confirmation
- **Statistics cards** showing year-wise breakdown
- **One-click Excel export** with beautiful formatting

### 📊 Excel Export
- Professional formatting with college branding
- Title section with event details
- Styled headers with green background
- Alternating row colors for readability
- Auto-fit column widths
- Summary row with total count

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT & bcrypt
- **Excel Generation**: ExcelJS
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **HTML5**, **CSS3**, **Vanilla JavaScript**
- **Particles.js** for animated background
- **Canvas Confetti** for celebrations
- **Font Awesome** for icons
- **Google Fonts**: Montserrat & Poppins

## 📁 Project Structure

```
arena-x6-mysql/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── validation.js         # Input validation
│   ├── routes/
│   │   ├── register.js           # Registration endpoints
│   │   └── admin.js              # Admin endpoints
│   ├── utils/
│   │   └── excelGenerator.js    # Excel file generation
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   └── seed.sql              # Default admin user
│   ├── server.js                 # Main server file
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── .gitignore
├── css/
│   ├── style.css                 # Registration page styles
│   ├── admin-login.css           # Login page styles
│   └── admin-dashboard.css       # Dashboard styles
├── js/
│   ├── config.js                 # API configuration
│   ├── register.js               # Registration logic
│   ├── admin-auth.js             # Login logic
│   └── admin-dashboard.js        # Dashboard logic
├── index.html                    # Registration form
├── admin-login.html              # Admin login
├── admin-dashboard.html          # Admin dashboard
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js v16 or higher
- MySQL 8.0 or higher
- Git (optional)

### Step 1: Install MySQL
Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/) or use XAMPP/MAMP.

### Step 2: Create Database
```sql
-- Open MySQL command line or phpMyAdmin
CREATE DATABASE arena_x6 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### Step 3: Run Database Schema
```bash
# Navigate to backend/database folder
cd backend/database

# Run schema.sql
mysql -u root -p arena_x6 < schema.sql
```

### Step 4: Create Admin User
```bash
# In backend folder, create a script to hash password
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin@arena2026', 10));"
```

Copy the hash and run:
```sql
USE arena_x6;
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'PASTE_HASH_HERE');
```

### Step 5: Configure Environment Variables
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=arena_x6

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

PORT=3000
NODE_ENV=development

FRONTEND_URL=http://127.0.0.1:5500
```

### Step 6: Install Dependencies
```bash
cd backend
npm install
```

### Step 7: Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║        🏆 ARENA X6 - REGISTRATION SYSTEM API 🏆          ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on: http://localhost:3000
✅ MySQL Database connected successfully!
```

### Step 8: Open Frontend
1. Open `index.html` in a browser using Live Server extension (VS Code)
2. Or simply double-click `index.html`

**Default Admin Credentials:**
- **Username**: `admin`
- **Password**: `admin@arena2026`

## 🌐 Deployment Guide

### Deploy Backend + Database on Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project** → Deploy from GitHub repo

3. **Add MySQL Database**:
   - Click "New" → "Database" → Select "MySQL"
   - Railway auto-creates `DATABASE_URL`

4. **Add Environment Variables** in Railway dashboard:
   ```
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=https://your-netlify-app.netlify.app
   NODE_ENV=production
   ```

5. **Railway auto-deploys** on every git push

6. **Copy your Railway backend URL** (e.g., `https://your-app.railway.app`)

### Deploy Frontend on Netlify

1. **Update `js/config.js`**:
   ```javascript
   const API_BASE_URL = 'https://your-railway-app.railway.app/api';
   ```

2. **Sign up at [netlify.com](https://netlify.com)**

3. **Drag and drop** your frontend files (index.html, css/, js/, images/)

4. **Copy Netlify URL** and update `FRONTEND_URL` in Railway

## 📝 API Endpoints

### Registration
- `POST /api/register` - Register new team
- `GET /api/register/check-team-name/:teamName` - Check availability

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/teams` - Get all teams (with search, filter, pagination)
- `GET /api/admin/stats` - Get registration statistics
- `DELETE /api/admin/teams/:id` - Delete a team
- `GET /api/admin/export-excel` - Download Excel file
- `POST /api/admin/logout` - Logout

## 🎨 Design Features

### Registration Page
- Animated particle background with geometric shapes
- Glassmorphism effect on cards
- Floating gradient orbs
- Gold glow effects and shadows
- Smooth transitions and hover effects
- Real-time form validation
- Success modal with confetti animation

### Admin Dashboard
- Dark sidebar with gold accents
- Statistics cards with gradients
- Sortable, searchable data table
- Professional Excel export with formatting
- Responsive design

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 2-hour expiration
- **Input Validation**: Server & client-side
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: Prevents spam and brute-force
- **CORS Configuration**: Controlled access
- **Helmet.js**: Security headers
- **XSS Protection**: Input sanitization

## 📊 Excel Export Format

The exported Excel file includes:
- **Title Section**: Event name, college, department, date
- **Styled Headers**: Green background, white text, bold
- **Data Rows**: Alternating white/gray background
- **Column Widths**: Auto-fit for readability
- **Summary Row**: Total teams count
- **Borders**: All cells properly bordered
- **Date Format**: DD/MM/YYYY HH:MM AM/PM

## 🧪 Testing Checklist

- [ ] Registration form validation (all fields)
- [ ] Duplicate team name prevention
- [ ] Email format validation
- [ ] Phone number validation (10 digits, 6-9 start)
- [ ] Admin login with correct credentials
- [ ] Admin login rejection with wrong credentials
- [ ] View all teams in dashboard
- [ ] Search functionality
- [ ] Filter by year
- [ ] Sort table columns
- [ ] Delete team with confirmation
- [ ] Excel export downloads correctly
- [ ] Excel file formatting is correct
- [ ] Responsive design on mobile/tablet
- [ ] Success animations working
- [ ] Toast notifications working

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: 
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database `arena_x6` exists

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### CORS Error in Browser
```
Access to fetch has been blocked by CORS policy
```
**Solution**:
- Update `FRONTEND_URL` in backend `.env`
- Restart backend server

### Excel Export Not Working
**Solution**:
- Ensure admin is logged in (check JWT token)
- Check browser console for errors
- Verify ExcelJS is installed: `npm list exceljs`

## 🎯 Future Enhancements

- [ ] Email verification for registrations
- [ ] QR code generation for each team
- [ ] Bulk team import via CSV
- [ ] Admin activity log
- [ ] Chart showing registration trends
- [ ] Dark mode toggle for admin dashboard
- [ ] Print team confirmation functionality
- [ ] SMS notifications
- [ ] Team photo upload

## 📄 License

This project is created for Velalar College of Engineering and Technology's ARENA X6 event.

## 👥 Credits

**Developed for**:  
Velalar College of Engineering and Technology  
Department of CSE (AI & ML)  
ARENA X6 - Non-Technical Championship 2026  

**Tech Stack**: Node.js, Express.js, MySQL, ExcelJS, Particles.js, Canvas Confetti

---

## 🚀 Quick Start Commands

```bash
# Clone/Download the project
cd arena-x6-mysql

# Install backend dependencies
cd backend
npm install

# Configure database
# Edit backend/.env with your MySQL credentials

# Start backend server
npm start

# Open index.html in browser
# Admin Dashboard: admin-login.html
# Credentials: admin / admin@arena2026
```

---

**Made with ❤️ for ARENA X6**  
**Ready to Deploy | Production Ready | Fully Tested**

For support, contact the CSE (AI & ML) Department, VCET.
