#!/bin/bash

# Arena X6 Registration - Render Startup Script
# This script initializes the database and starts the server

echo "🚀 Starting Arena X6 Registration System..."

# Create data directory if it doesn't exist
mkdir -p data

# Check if database exists
if [ ! -f "data/arena_x6.db" ]; then
    echo "📦 Database not found. Creating and initializing..."
    node generate-admin.js
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully"
    else
        echo "❌ Database initialization failed"
        exit 1
    fi
else
    echo "✅ Database already exists"
fi

# Start the server
echo "🌐 Starting Express server..."
node server.js
