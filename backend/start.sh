#!/bin/bash

# Arena X6 Registration System - Render Startup Script
# This script automatically initializes the database, sets up frontend and backend

echo "============================================"
echo "Arena X6 Registration System - Starting..."
echo "============================================"

# Create data directory if it doesn't exist
echo "Creating data directory..."
mkdir -p data

# Check if database file exists
if [ ! -f "data/arena_x6.db" ]; then
    echo ""
    echo "Database not found. Initializing..."
    echo "Creating admin user (admin/admin@arena2026)..."
    node generate-admin.js
    
    if [ $? -eq 0 ]; then
        echo "✓ Database initialized successfully!"
    else
        echo "✗ Error: Failed to initialize database"
        exit 1
    fi
else
    echo "✓ Database already exists"
fi

echo ""
echo "============================================"
echo "Starting server (frontend + backend)..."
echo "============================================"
echo "Frontend will be available at: /"
echo "Backend API will be available at: /api/*"
echo "Admin login at: /admin-login"
echo "============================================"
echo ""

# Start the server (serves both frontend and backend)
node server.js
