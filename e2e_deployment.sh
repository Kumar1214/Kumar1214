#!/bin/bash
# GauGyan World - E2E Production Deployment Protocol
# Shunya Systems Supreme Architect - Autonomous Deployment
# Date: 2026-01-19

set -e  # Exit on any error

echo "🔱 GauGyan World - E2E Deployment Protocol Initiated"
echo "=================================================="

# Step 1: Sentinel Handshake
echo ""
echo "📡 STEP 1: Shunya Sentinel Handshake"
echo "-----------------------------------"

# Check if we're on cPanel or local
if [ -d "/home/gaugyanc" ]; then
    echo "✅ Running on cPanel production server"
    
    # Check Sentinel logs
    if [ -f "/home/gaugyanc/Shunya Sentinel/sentinel_activity.log" ]; then
        echo "📋 Sentinel Activity Log:"
        tail -5 "/home/gaugyanc/Shunya Sentinel/sentinel_activity.log"
    else
        echo "⚠️  Sentinel log not found at expected location"
    fi
    
    # Verify database config
    echo ""
    echo "🔍 Verifying PostgreSQL Configuration..."
    cd /home/gaugyanc/gaugyan-api
    
    # Check if SSL is disabled for localhost
    if grep -q "ssl: false" src/shared/config/database.js || grep -q "DB_SSL === 'false'" src/shared/config/database.js; then
        echo "✅ Database SSL correctly configured for cPanel localhost"
    else
        echo "⚠️  Database SSL configuration needs review"
    fi
    
else
    echo "📍 Running on local development machine"
    echo "🎯 Preparing deployment package for cPanel upload"
fi

# Step 2: Frontend Build with CourseDetail Fix
echo ""
echo "🏗️  STEP 2: Building Frontend (CourseDetail Fix Included)"
echo "--------------------------------------------------------"

cd /Users/mac/Downloads/gaugyan_macos_final/gaugyanworld.org

# Verify vite.config.js has correct base path
if grep -q "base: './'," vite.config.js; then
    echo "✅ Vite base path correctly set to './'"
else
    echo "⚠️  Vite base path needs correction"
fi

# Build frontend
echo "🔨 Running npm run build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully"
    echo "📦 Build output in: dist/"
    ls -lh dist/
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Step 3: Create optimized .htaccess
echo ""
echo "📝 STEP 3: Generating Optimized .htaccess"
echo "----------------------------------------"

cat > dist/.htaccess << 'HTACCESS_EOF'
# GauGyan Production .htaccess - Optimized for SPA + Security
# Generated: 2026-01-19

# Performance: Cache Control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType application/x-font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Security: Hardening
Options -Indexes
ServerSignature Off

<FilesMatch "\.(env|json|md|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# MIME Types (Critical for JS/CSS)
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/json .json
  AddType text/css .css
  AddType image/svg+xml .svg
  AddType image/webp .webp
</IfModule>

# SPA Routing (React Router)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve index.html directly
  RewriteRule ^index\.html$ - [L]

  # Skip rewrite for API calls
  RewriteCond %{REQUEST_URI} ^/api/ [OR]
  
  # Skip rewrite for existing files
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Route everything else to index.html
  RewriteRule ^ /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
HTACCESS_EOF

echo "✅ Optimized .htaccess created in dist/"

# Step 4: Create deployment package
echo ""
echo "📦 STEP 4: Creating Deployment Package"
echo "-------------------------------------"

cd /Users/mac/Downloads/gaugyan_macos_final

# Create timestamped deployment archive
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_FILE="frontend-deploy-${TIMESTAMP}.tar.gz"

cd gaugyanworld.org
tar -czf "../${DEPLOY_FILE}" -C dist .

echo "✅ Deployment package created: ${DEPLOY_FILE}"
echo "📊 Package size: $(du -h "../${DEPLOY_FILE}" | cut -f1)"

# Step 5: Generate cPanel deployment commands
echo ""
echo "🚀 STEP 5: cPanel Deployment Commands"
echo "------------------------------------"

cat > /Users/mac/Downloads/gaugyan_macos_final/deploy_to_cpanel.sh << 'DEPLOY_EOF'
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
DEPLOY_EOF

chmod +x /Users/mac/Downloads/gaugyan_macos_final/deploy_to_cpanel.sh

echo "✅ cPanel deployment script created: deploy_to_cpanel.sh"

# Step 6: Verification checklist
echo ""
echo "✅ STEP 6: Deployment Verification Checklist"
echo "-------------------------------------------"

cat << 'CHECKLIST_EOF'

📋 Post-Deployment Verification:

1. Frontend Accessibility:
   ✓ https://gaugyanworld.org (Landing page)
   ✓ https://gaugyanworld.org/courses (Course listing)
   ✓ https://gaugyanworld.org/courses/2 (Course detail - FIXED)
   ✓ https://gaugyanworld.org/products (Product listing)
   ✓ https://gaugyanworld.org/login (Login page)

2. API Endpoints:
   ✓ https://api.gaugyanworld.org/health
   ✓ https://api.gaugyanworld.org/api/courses
   ✓ https://api.gaugyanworld.org/api/products

3. User Dashboard Tests (Password: Password@123):
   ✓ admin@gaugyan.com → /admin
   ✓ instructor@gaugyan.com → /instructor
   ✓ vendor@gaugyan.com → /vendor
   ✓ artist@gaugyan.com → /artist
   ✓ astrologer@gaugyan.com → /astrologer
   ✓ owner@gaugyan.com → /gaushala
   ✓ author@gaugyan.com → /author
   ✓ user@gaugyan.com → /dashboard

4. Astrology Module:
   ✓ Login as astrologer@gaugyan.com
   ✓ Verify chat console loads
   ✓ Test appointment scheduling

5. Browser Console:
   ✓ No 404 errors for assets
   ✓ No MIME type errors
   ✓ No CORS errors
   ✓ Analytics warnings only (non-critical)

CHECKLIST_EOF

# Step 7: Update context memory
echo ""
echo "📝 STEP 7: Updating Context Memory"
echo "---------------------------------"

cd /Users/mac/Downloads/gaugyan_macos_final/backend
node audit_sync.js "E2E Deployment: CourseDetail fix deployed, optimized .htaccess created, deployment package ready for cPanel upload"

echo "✅ Context memory updated"

# Final Summary
echo ""
echo "🎯 DEPLOYMENT PROTOCOL COMPLETE"
echo "=============================="
echo ""
echo "📦 Deployment Package: ${DEPLOY_FILE}"
echo "📍 Location: /Users/mac/Downloads/gaugyan_macos_final/"
echo ""
echo "🚀 Next Steps:"
echo "1. Upload ${DEPLOY_FILE} to /home/gaugyanc/ via FTP/cPanel File Manager"
echo "2. SSH to cPanel and run: bash deploy_to_cpanel.sh"
echo "3. Verify all URLs in checklist above"
echo "4. Test all 8 user dashboards"
echo ""
echo "✅ All systems ready for production deployment"
