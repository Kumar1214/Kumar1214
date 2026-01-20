#!/bin/bash
# Execute this script on cPanel terminal

echo "🔱 GauGyan Frontend Deployment to cPanel"
echo "========================================"

# Navigate to web root
cd /home/gaugyanc/public_html/gaugyanworld.org

# Backup current deployment
echo "📦 Creating backup..."
BACKUP_DIR="../gaugyanworld_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r * "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ Backup created: $BACKUP_DIR"

# Upload and extract new build
# (Upload frontend-deploy-*.tar.gz to /home/gaugyanc/ first)
echo ""
echo "📥 Extracting new build..."
cd /home/gaugyanc/public_html/gaugyanworld.org
tar -xzf /home/gaugyanc/frontend-deploy-*.tar.gz

echo "✅ Frontend deployed successfully"

# Verify deployment
echo ""
echo "🔍 Verification:"
echo "- index.html: $([ -f index.html ] && echo '✅ Present' || echo '❌ Missing')"
echo "- assets/: $([ -d assets ] && echo '✅ Present' || echo '❌ Missing')"
echo "- .htaccess: $([ -f .htaccess ] && echo '✅ Present' || echo '❌ Missing')"

# Test site
echo ""
echo "🌐 Testing live site..."
curl -I https://gaugyanworld.org | head -5

echo ""
echo "✅ Deployment complete!"
echo "🔗 Visit: https://gaugyanworld.org"
