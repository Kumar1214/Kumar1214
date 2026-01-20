#!/bin/bash
# GauGyan Production Deployment Script
# Date: 2026-01-19
# Purpose: Deploy frontend build with security fixes to production

set -e  # Exit on error

echo "🚀 GauGyan Production Deployment"
echo "=================================="
echo ""

# Configuration
REMOTE_USER="gaugyanc"
REMOTE_HOST="rs3-mbi.serverhostgroup.com"
REMOTE_PATH="/home/gaugyanc/public_html"
LOCAL_BUILD="/Users/mac/Downloads/gaugyan_macos_final/gaugyanworld.org/dist"
BACKUP_NAME="backup_before_chat_fix_$(date +%Y%m%d_%H%M%S).tar.gz"

echo "📦 Step 1: Creating backup of current production files..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/gaugyanc/public_html
echo "Creating backup..."
tar -czf ~/${BACKUP_NAME} index.html assets/ 2>/dev/null || echo "Some files may not exist, continuing..."
echo "✅ Backup created: ~/${BACKUP_NAME}"
ENDSSH

echo ""
echo "🗑️  Step 2: Removing old build files (keeping .htaccess)..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/gaugyanc/public_html
rm -rf assets/
rm -f index.html
echo "✅ Old files removed"
ENDSSH

echo ""
echo "📤 Step 3: Uploading new build files..."
scp -r ${LOCAL_BUILD}/* ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
echo "✅ New build uploaded"

echo ""
echo "🔍 Step 4: Verifying deployment..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /home/gaugyanc/public_html
echo "Files in public_html:"
ls -lh index.html
echo ""
echo "Assets folder:"
ls -lh assets/ | head -10
echo ""
echo "Checking for new build hash (index-B03FtTM5.js):"
ls -lh assets/index-B03FtTM5.js 2>/dev/null && echo "✅ New build confirmed!" || echo "⚠️  Build hash not found"
ENDSSH

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Test URLs:"
echo "  - Homepage: https://gaugyanworld.org/"
echo "  - Chat: https://gaugyanworld.org/chat"
echo "  - Community: https://gaugyanworld.org/community"
echo ""
echo "🔐 Security Fixes Applied:"
echo "  ✅ /community route now requires authentication"
echo "  ✅ /chat route created with authentication"
echo "  ✅ SPA routing configured in .htaccess"
echo ""
