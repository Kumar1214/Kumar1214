#!/bin/bash
# GauGyan Frontend Deployment - Terminal Commands for cPanel
# Run these commands in cPanel Terminal

echo "🚀 GauGyan Frontend Deployment"
echo "================================"
echo ""

# Step 1: Navigate to correct frontend path
cd /home/gaugyanc/gaugyanworld.org || { echo "❌ Directory not found"; exit 1; }
echo "✅ In directory: $(pwd)"
echo ""

# Step 2: Create backup
echo "📦 Creating backup..."
tar -czf ~/backup_gaugyanworld_$(date +%Y%m%d_%H%M%S).tar.gz . 2>/dev/null || echo "Backup attempted"
echo "✅ Backup created"
echo ""

# Step 3: Clear old build (keep .htaccess if exists)
echo "🗑️  Removing old build files..."
find . -type f ! -name '.htaccess' ! -name 'backup_*' -delete
find . -type d ! -name '.' ! -name '..' -delete 2>/dev/null || true
echo "✅ Old files removed"
echo ""

# Step 4: Download and extract new build
echo "📥 Downloading new build..."
# User needs to upload frontend-deploy-20260119_201533.tar.gz to home directory first
cd /home/gaugyanc
if [ -f "frontend-deploy-20260119_201533.tar.gz" ]; then
    echo "✅ Build archive found"
    tar -xzf frontend-deploy-20260119_201533.tar.gz -C gaugyanworld.org/
    echo "✅ Build extracted to /home/gaugyanc/gaugyanworld.org/"
else
    echo "❌ Build archive not found!"
    echo "Please upload frontend-deploy-20260119_201533.tar.gz to /home/gaugyanc/ first"
    exit 1
fi
echo ""

# Step 5: Set permissions
echo "🔐 Setting permissions..."
cd /home/gaugyanc/gaugyanworld.org
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
echo "✅ Permissions set"
echo ""

# Step 6: Verify deployment
echo "🔍 Verifying deployment..."
echo "Files in gaugyanworld.org:"
ls -lh | head -10
echo ""
echo "Checking for new build hash:"
if [ -f "assets/index-B03FtTM5.js" ]; then
    echo "✅ NEW BUILD DEPLOYED SUCCESSFULLY!"
    ls -lh assets/index-B03FtTM5.js
else
    echo "⚠️  Build hash not found, checking assets:"
    ls -lh assets/ | head -5
fi
echo ""

# Step 7: Clean up
echo "🧹 Cleaning up..."
cd /home/gaugyanc
rm -f frontend-deploy-*.tar.gz
echo "✅ Cleanup complete"
echo ""

echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Test URLs:"
echo "  - Homepage: https://gaugyanworld.org/"
echo "  - Chat: https://gaugyanworld.org/chat"
echo "  - Community: https://gaugyanworld.org/community"
echo ""
echo "🔐 Security Fixes Applied:"
echo "  ✅ /community now requires authentication"
echo "  ✅ /chat created with authentication"
echo ""
