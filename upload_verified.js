const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

async function uploadWithVerification() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🔧 Connecting to FTP server...");
        await client.access({
            host: "148.113.35.111",
            user: "gaugyan@gaugyanworld.org",
            password: "Password@2026_GG_",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("✅ Connected.");

        const remotePath = "/home/gaugyanc/gaugyanworld.org";
        await client.ensureDir(remotePath);

        // Read local file
        const localIndexPath = path.join(__dirname, "gaugyanworld.org/dist/index.html");
        const localContent = fs.readFileSync(localIndexPath, 'utf8');

        console.log("📄 Local index.html contains:");
        console.log(localContent.substring(300, 600)); // Show the script tag area

        if (!localContent.includes('index-CUZX9qeq.js')) {
            throw new Error("❌ Local file doesn't have the expected hash!");
        }

        // Delete old file first
        try {
            console.log("🗑️ Deleting old index.html...");
            await client.remove(`${remotePath}/index.html`);
            console.log("✅ Deleted.");
        } catch (e) {
            console.log("⚠️ Delete failed (might not exist):", e.message);
        }

        // Upload using uploadFrom with explicit path
        console.log(`📤 Uploading to ${remotePath}/index.html...`);
        await client.uploadFrom(localIndexPath, `${remotePath}/index.html`);
        console.log("✅ Upload complete.");

        // Download and verify
        console.log("🔍 Downloading to verify...");
        const tempPath = path.join(__dirname, "temp_verify.html");
        await client.downloadTo(tempPath, `${remotePath}/index.html`);

        const remoteContent = fs.readFileSync(tempPath, 'utf8');
        console.log("\n📄 Remote index.html contains:");
        console.log(remoteContent.substring(300, 600));

        if (remoteContent.includes('index-CUZX9qeq.js')) {
            console.log("\n✅✅✅ VERIFICATION SUCCESS! Remote file has index-CUZX9qeq.js");
        } else if (remoteContent.includes('index-CGXrhE-O.js')) {
            console.log("\n❌❌❌ VERIFICATION FAILED! Remote still has OLD hash: index-CGXrhE-O.js");
        } else {
            console.log("\n⚠️ WARNING: Remote file has unexpected content");
        }

        // Cleanup
        fs.unlinkSync(tempPath);

        // Also upload all assets to be safe
        console.log("\n📦 Uploading all assets...");
        await client.uploadFromDir(
            path.join(__dirname, "gaugyanworld.org/dist/assets"),
            `${remotePath}/assets`
        );
        console.log("✅ Assets uploaded.");

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        client.close();
    }
}

uploadWithVerification();
