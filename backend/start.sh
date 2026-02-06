#!/bin/bash

# Arena X6 Registration System - Render Startup Script
# This script automatically initializes the database, sets up frontend and backend

echo "============================================"
echo "Arena X6 Registration System - Starting..."
echo "============================================"

# Create data directory if it doesn't exist
echo "Creating data directory..."
mkdir -p data

# Always run admin setup to ensure admin user exists
echo ""
echo "Initializing admin user..."
node generate-admin.js

if [ $? -eq 0 ]; then
    echo "✓ Admin user setup completed!"
else
    echo "✗ Warning: Admin setup had issues, but continuing..."
fi

# Verify database exists
if [ -f "data/arena_x6.db" ]; then
    echo "✓ Database file exists"
    ls -lh "data/arena_x6.db"
else
    echo "⚠ Warning: Database file not found, it will be created on first request"
fi

echo ""
echo "============================================"
echo "Starting server (frontend + backend)..."
echo "============================================"
echo "Frontend will be available at: /"
echo "Backend API will be available at: /api/*"
echo "Admin login at: /admin-login"
echo "Diagnostic endpoint: /api/diagnostic"
echo "Admin check: /api/admin/check-setup"
echo "============================================"
echo ""

# Start the server (serves both frontend and backend)
node server.js
