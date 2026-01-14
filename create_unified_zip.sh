#!/bin/bash

# Unified App Deployment Script
# Creates a single zip with:
# 1. gaugyanworld.org (Frontend Build)
# 2. gaugyan-api (Backend Source)

echo "=========================================="
echo "   GAUGYAN AI: Creating Unified Zip bundle"
echo "=========================================="

DEPLOY_DIR="deployment_staging"
ZIP_NAME="gaugyan_cpanel_full_deploy.zip"

# Cleanup previous runs
rm -rf $DEPLOY_DIR
rm -f $ZIP_NAME
mkdir -p $DEPLOY_DIR

# ---------------------------------------------------------
# 1. FRONTEND BUILD
# ---------------------------------------------------------
echo "[1/4] Building Frontend..."
# Ensure deps (optional but safer)
# npm install --legacy-peer-deps

# Run Build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# Prepare Directory
mkdir -p $DEPLOY_DIR/gaugyanworld.org
cp -a dist/. $DEPLOY_DIR/gaugyanworld.org/
echo "✅ Frontend staged."


# ---------------------------------------------------------
# 2. BACKEND PACKAGE
# ---------------------------------------------------------
echo "[2/4] Staging Backend..."
mkdir -p $DEPLOY_DIR/gaugyan-api

# Sync files (Excluding heavy/unnecessary items)
rsync -av \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'logs' \
    --exclude 'coverage' \
    --exclude 'tests' \
    --exclude '.DS_Store' \
    --exclude '*.sqlite' \
    --exclude '*.zip' \
    backend/ $DEPLOY_DIR/gaugyan-api/

# Config Setup
echo "Configuring Backend Environment..."
if [ -f "backend/.env.production" ]; then
    cp "backend/.env.production" "$DEPLOY_DIR/gaugyan-api/.env"
    echo "✅ Copied backend/.env.production to .env"
else
    echo "⚠️  WARNING: backend/.env.production NOT FOUND. Using default .env"
    cp "backend/.env" "$DEPLOY_DIR/gaugyan-api/.env" 2>/dev/null || echo "No .env found!"
fi

# ---------------------------------------------------------
# 3. EXTRAS
# ---------------------------------------------------------
echo "[3/4] Adding Database Dump..."
if [ -f "gaugyanc_gaugyanworld.sql" ]; then
    cp "gaugyanc_gaugyanworld.sql" "$DEPLOY_DIR/gaugyan-api/"
fi

# ---------------------------------------------------------
# 4. ZIP IT UP
# ---------------------------------------------------------
echo "[4/4] Creating Zip Archive..."
cd $DEPLOY_DIR
zip -r ../$ZIP_NAME .
cd ..

# Cleanup Staging
rm -rf $DEPLOY_DIR

echo "=========================================="
echo "🎉 SUCCESS via create_unified_zip.sh"
echo "Archive created: $ZIP_NAME"
echo "Contains:"
echo " - gaugyanworld.org/ (Frontend Dist)"
echo " - gaugyan-api/      (Backend Source)"
echo "=========================================="
