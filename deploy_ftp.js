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
        secure: true, // Use Explicit FTPS
        port: 21,
        exclude: []
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
            secureOptions: { rejectUnauthorized: false } // Self-signed cert workaround
        });
        console.log('✅ Connected.');

        // 2. Ensure Remote Dir
        console.log(`Ensuring remote directory: ${config.remoteDir}`);
        await client.ensureDir(config.remoteDir);

        // 3. Clear Remote Dir (Optional: Be careful!)
        // For now, we overwrite. Users usually want a clean slate for 'dist', but backend config files?
        // User requested "combine files", implies clean sync.
        // However, wiping backend might kill logs/uploads. Let's just upload/overwrite.

        // 4. Upload
        console.log(`Uploading from ${config.localDir} to ${config.remoteDir}...`);

        // Custom logic for exclusion if uploading directory
        // basic-ftp doesn't have a simple "exclude" list for uploadFromDir
        // We handle it by relying on the fact that 'backend' has a lot of files.
        // Actually, `create_cpanel_deployment.sh` created a clean folder `staging_backend`.
        // We should probably use `staging_backend/gaugyan-api` if it exists, OR just carefully upload.

        // Better strategy for Backend: Upload directory but ignore node_modules
        // Since basic-ftp uploads everything in the dir, we rely on the clean structure.
        // If we use the raw `backend` folder, we upload `node_modules`. THAT IS BAD.

        // FIX: We will verify if `staging_backend` exists from the previous sh script.
        // If not, we error out and ask to run the build script first.

        let sourcePath = config.localDir;

        // Special handling for Backend to avoid node_modules upload
        if (config.name === 'Backend') {
            // Check if we have a clean staging area?
            // Let's assume the user wants us to be smart.
            // We can iterate and upload specific folders, but that's complex.
            // EASIER: Check if we have the zip? No, FTP needs files.
            // Let's rely on the previous tool call `create_cpanel_deployment.sh` which created `staging_backend`.
            // Wait, that script cleans up staging_backend at the end.
            // So we have to use the source `backend` folder but MUST skip node_modules.

            // client.uploadFromDir sends EVERYTHING.
            // We must implement a filter or use a specific clean folder.

            console.log('⚠️ Backend upload: We need to avoid node_modules.');
            // Strategy: We will create a temp clean folder for upload
        }

        await client.uploadFromDir(sourcePath, config.remoteDir);

        console.log(`✅ ${config.name} Deployment Complete!`);

    } catch (err) {
        console.error(`❌ ${config.name} Deployment Failed:`, err);
    } finally {
        client.close();
    }
}

// Check if build artifacts exist or create temp clean folders
async function run() {

    // We need to rebuild the clean staging folders because the previous script deleted them.
    console.log('🔧 preparing clean artifacts for FTP...');
    const { execSync } = require('child_process');

    // Re-run build script but modify it to NOT delete staging? 
    // Or just manually rsync to a temp folder here.

    // 1. Frontend is `gaugyanworld.org/dist`. This is safe (no node_modules).

    // 2. Backend needs cleaning.
    const backendCleanPath = path.join(__dirname, 'temp_ftp_backend');
    if (fs.existsSync(backendCleanPath)) fs.rmSync(backendCleanPath, { recursive: true, force: true });
    fs.mkdirSync(backendCleanPath);

    console.log('Copying backend files (excluding node_modules)...');
    // Use rsync to copy to temp_ftp_backend
    execSync(`rsync -av --exclude node_modules --exclude .git --exclude .env --exclude coverage backend/ temp_ftp_backend/`, { stdio: 'inherit' });

    // Update Backend config to use clean path
    DEPLOYMENTS[1].localDir = path.join(backendCleanPath, 'backend'); // rsync creates 'backend' folder inside temp?
    // rsync `backend/ target/` puts contents in target if slash used?
    // rsync `backend/ temp_ftp_backend/` -> puts contents in temp_ftp_backend

    // So localDir should be backendCleanPath
    DEPLOYMENTS[1].localDir = backendCleanPath;

    // Execute
    await deploy(DEPLOYMENTS[0]); // Frontend
    await deploy(DEPLOYMENTS[1]); // Backend

    // Cleanup
    console.log('Cleaning up temp files...');
    fs.rmSync(backendCleanPath, { recursive: true, force: true });
}

run();
