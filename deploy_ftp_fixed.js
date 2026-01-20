const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const DEPLOYMENTS = [
    {
        name: 'Frontend',
        host: 'ftp.gaugyan.com',
        user: 'gaugyan@gaugyanworld.org',
        password: 'Password@2026_GG_',
        localDir: path.join(__dirname, 'gaugyanworld.org/dist'),
        remoteDir: '/home/gaugyanc/gaugyanworld.org',
        secure: true,
        port: 21
    },
    {
        name: 'Backend',
        host: 'ftp.gaugyan.com',
        user: 'guagyanapi@gaugyan.com',
        password: 'Password@2026_GG_',
        localDir: path.join(__dirname, 'backend'),
        remoteDir: '/home/gaugyanc/gaugyan-api',
        secure: true,
        port: 21,
        exclude: ['node_modules', '.git', 'coverage', 'tests', '.env', '.DS_Store']
    }
];

async function deploy(config) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    console.log(`\n🚀 Starting deployment for: ${config.name}`);

    try {
        // 1. Connect
        console.log(`Connecting to ${config.host} as ${config.user}...`);
        await client.access({
            host: config.host,
            user: config.user,
            password: config.password,
            secure: config.secure,
            port: config.port,
            secureOptions: { rejectUnauthorized: false }
        });
        console.log('✅ Connected.');

        // 2. Ensure Remote Dir exists and navigate to it
        console.log(`Ensuring remote directory: ${config.remoteDir}`);
        await client.ensureDir(config.remoteDir);
        await client.cd(config.remoteDir);

        // 3. Upload files - CRITICAL FIX for nested path issue
        console.log(`Uploading from ${config.localDir} to ${config.remoteDir}...`);

        // Save original working directory
        const originalCwd = process.cwd();

        try {
            // Change to source directory to prevent absolute path nesting
            process.chdir(config.localDir);

            // Upload from current directory (.) - this prevents creating nested /home/gaugyanc paths
            console.log(`📤 Uploading files from current directory...`);
            await client.uploadFromDir('.');

            console.log(`✅ ${config.name} Deployment Complete!`);
        } finally {
            // Always restore original directory
            process.chdir(originalCwd);
        }

    } catch (err) {
        console.error(`❌ ${config.name} Deployment Failed:`, err);
    } finally {
        client.close();
    }
}

async function main() {
    console.log('🔧 GauGyan Deployment Script - FTP Mode');
    console.log('========================================\n');

    for (const config of DEPLOYMENTS) {
        await deploy(config);
    }

    console.log('\n✅ All deployments completed!');
}

main().catch(console.error);
