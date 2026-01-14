#!/bin/bash

echo "=========================================="
echo "   GAUGYAN AI: Creating SEPARATED Zips    "
echo "=========================================="

# 1. Frontend Build & Zip
echo "[1/4] Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "[2/4] Zipping Frontend (gaugyanworld.org)..."
rm -rf gaugyanworld.org
mkdir -p gaugyanworld.org
cp -r dist/* gaugyanworld.org/
cp gaugyan-logo.png gaugyanworld.org/
# Ensure htaccess for React Router
echo "<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>" > gaugyanworld.org/.htaccess

zip -r cpanel_frontend_deploy.zip gaugyanworld.org
echo "✅ cpanel_frontend_deploy.zip created."

# 2. Backend Zip
echo "[3/4] Preparing Backend..."
rm -rf gaugyan-api
mkdir -p gaugyan-api
cp -r backend/* gaugyan-api/
cp .env.production gaugyan-api/.env
cp gaugyanc_gaugyanworld.sql gaugyan-api/

# Cleanup Backend
rm -rf gaugyan-api/node_modules
rm -rf gaugyan-api/logs
rm -f gaugyan-api/.DS_Store

echo "[4/4] Zipping Backend (gaugyan-api)..."
zip -r cpanel_backend_deploy.zip gaugyan-api

echo "=========================================="
echo "🎉 SUCCESS: Created separate zips"
echo " - cpanel_frontend_deploy.zip"
echo " - cpanel_backend_deploy.zip"
echo "=========================================="
