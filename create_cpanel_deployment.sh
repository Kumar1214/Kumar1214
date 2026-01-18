#!/bin/bash

# Deployment Script for cPanel (Mac/Linux compatible)

echo "Starting cPanel Deployment Build..."

# 1. Frontend Build
echo "Building Frontend..."
cd gaugyanworld.org
rm -rf dist
# Ensure deps are installed (fast if already present)
npm install --legacy-peer-deps

echo "Running npm run build with increased memory..."
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

if [ $? -ne 0 ]; then
    echo "Frontend build failed!"
    exit 1
fi

# Staging Frontend
echo "Staging Frontend..."
cd ..
rm -rf staging_frontend
mkdir -p staging_frontend/gaugyanworld.org
cp -a gaugyanworld.org/dist/. staging_frontend/gaugyanworld.org/

# Zip Frontend
echo "Zipping Frontend..."
rm -f cpanel_frontend_deploy.zip
cd staging_frontend
zip -r ../cpanel_frontend_deploy.zip gaugyanworld.org
cd ..

# 2. Backend Package
echo "Packaging Backend..."
rm -rf staging_backend
mkdir -p staging_backend/gaugyan-api

# Copy backend files excluding node_modules/git/logs
echo "Copying Backend Files..."
# Using rsync for cleaner exclusion
rsync -av --progress backend/ staging_backend/gaugyan-api/ \
    --exclude .git \
    --exclude .DS_Store \
    --exclude "*.log" \
    --exclude "*.sqlite" \
    --exclude "*.zip" \
    --exclude "coverage" \
    --exclude "tests"

# Handle .env - Prefer root .env.production if backend one missing
echo "Configuring backend .env..."
if [ -f "backend/.env.production" ]; then
    cp "backend/.env.production" "staging_backend/gaugyan-api/.env"
elif [ -f ".env.production" ]; then
    echo "Using root .env.production..."
    cp ".env.production" "staging_backend/gaugyan-api/.env"
else
    echo "WARNING: .env.production not found!"
fi

# Copy Database SQL Dump
echo "Copying Database SQL..."
if [ -f "gaugyanc_gaugyanworld.sql" ]; then
    cp "gaugyanc_gaugyanworld.sql" "staging_backend/gaugyan-api/gaugyanc_gaugyanworld.sql"
else 
    echo "WARNING: gaugyanc_gaugyanworld.sql not found!"
fi

# Zip Backend
echo "Zipping Backend..."
rm -f cpanel_backend_deploy.zip
cd staging_backend
zip -r ../cpanel_backend_deploy.zip gaugyan-api
cd ..

# Cleanup
rm -rf staging_frontend
rm -rf staging_backend

echo "Deployment zips created successfully:"
echo "1. cpanel_frontend_deploy.zip"
echo "2. cpanel_backend_deploy.zip"
