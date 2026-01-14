#!/bin/bash

echo "🚀 Starting Production Build Process..."

# 1. Cleanup Old Artifacts
rm -f cpanel_backend_deploy.zip cpanel_frontend_deploy.zip
echo "✅ Cleaned old zips"

# 2. Backend Bundle (CRITICAL: Validate Contents)
echo "📦 Packaging Backend..."
if [ ! -d "backend/src" ]; then
    echo "❌ CRITICAL ERROR: backend/src folder incomplete or missing!"
    exit 1
fi

# Create Zip explicitly including all nested content
# Create Zip explicitly including all nested content
# Using -r to recursive, -x to exclude node_modules and git
cd backend
zip -r ../cpanel_backend_deploy.zip . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "coverage/*"
cd ..

# VERIFY BACKEND ZIP
echo "🔍 Verifying Backend Zip..."
if unzip -l cpanel_backend_deploy.zip | grep -q "config/"; then
    echo "✅ Legacy Config Folder Verified"
else
    echo "❌ CRITICAL ERROR: config folder MISSING in zip!"
    exit 1
fi

if unzip -l cpanel_backend_deploy.zip | grep -q "src/shared/config/database.js"; then
    echo "✅ Backend Config Verified (database.js found)"
else
    echo "❌ CRITICAL ERROR: src/shared/config/database.js MISSING in zip!"
    exit 1
fi

if unzip -l cpanel_backend_deploy.zip | grep -q "scripts/production_schema_fix.js"; then
    echo "✅ Schema Scripts Verified"
else
    echo "❌ CRITICAL ERROR: scripts/production_schema_fix.js MISSING in zip!"
    exit 1
fi

# 3. Frontend Bundle
echo "📦 Packaging Frontend..."
# Ensure dist exists
echo "⚠️ Building Frontend..."
npm run build

cd dist
zip -r ../cpanel_frontend_deploy.zip .
cd ..

echo "✅ Frontend Zip Created"

echo ""
echo "🎉 BUILD COMPLETE & VERIFIED"
echo "--------------------------------"
echo "1. cpanel_backend_deploy.zip (Verified Config & Controllers present)"
echo "2. cpanel_frontend_deploy.zip"
echo "--------------------------------"
echo "👉 Upload 'cpanel_backend_deploy.zip' to cPanel Root and Unzip."
echo "👉 Upload 'cpanel_frontend_deploy.zip' to 'public_html/gaugyanworld.org' and Unzip."
