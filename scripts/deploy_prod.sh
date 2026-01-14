#!/bin/bash

# PRODUCTION DEPLOYMENT SCRIPT
# This script automates the update process using the specific virtual environment paths provided.

# 1. Define Variables
SERVER_USER="gaugyanc"
SERVER_HOST="gaugyanworld.org" # Assumed based on URL, please edit if different
REMOTE_PATH="/home/gaugyanc/gaugyan-api"
VENV_ACTIVATE="/home/gaugyanc/nodevenv/gaugyan-api/20/bin/activate"

echo "==========================================="
echo "   GAUGYAN AI: STARTING PRODUCTION SYNC    "
echo "==========================================="

# 2. Upload Artifacts (Requires SSH Key or Password)
echo "[1/3] Uploading Deployment Bundles..."
scp ../cpanel_backend_deploy.zip $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/
scp ../cpanel_frontend_deploy.zip $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/

# 3. Remote Execution
echo "[2/3] Accessing Remote Terminal & Installing..."
ssh $SERVER_USER@$SERVER_HOST << EOF
    # Activate Environment (User Provided Command)
    source $VENV_ACTIVATE
    cd $REMOTE_PATH
    
    # Backup Config
    cp .env .env.backup
    
    # Unzip Backend
    unzip -o cpanel_backend_deploy.zip -d .
    
    # Install Missing Dependencies (like sweetalert2)
    npm install
    
    # Restart Server
    echo "Restarting application via PM2/Passenger..."
    if command -v pm2 &> /dev/null; then
        pm2 reload server || pm2 start server.js
    else
        # Fallback for Passenger: touch restart.txt
        mkdir -p tmp
        touch tmp/restart.txt
    fi
    
    echo "✅ Backend Updated."
EOF

echo "[3/3] Deployment Complete!"
