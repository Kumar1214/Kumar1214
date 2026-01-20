#!/bin/bash
# Deploy to CORRECT frontend path per MPC

echo "�� Deploying to CORRECT path: /home/gaugyanc/gaugyanworld.org"

# Use FTP to deploy to correct path
node -e "
const ftp = require('basic-ftp');
const path = require('path');

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        await client.access({
            host: 'ftp.gaugyan.com',
            user: 'gaugyan@gaugyanworld.org',
            password: 'Password@2026_GG_',
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        
        console.log('✅ Connected to FTP');
        
        // Ensure directory exists
        await client.ensureDir('/home/gaugyanc/gaugyanworld.org');
        
        // Upload dist contents
        console.log('📤 Uploading build...');
        await client.uploadFromDir(
            path.join(__dirname, 'gaugyanworld.org/dist'),
            '/home/gaugyanc/gaugyanworld.org'
        );
        
        console.log('✅ Deployment Complete!');
    } catch(err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.close();
    }
}

deploy();
"
