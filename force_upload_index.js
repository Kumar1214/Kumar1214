const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function forceUploadIndex() {
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

        // Navigate to the target directory
        await client.ensureDir("/home/gaugyanc/gaugyanworld.org");

        // Delete old index.html first to force overwrite
        try {
            console.log("🗑️  Deleting old index.html...");
            await client.remove("/home/gaugyanc/gaugyanworld.org/index.html");
            console.log("✅ Old index.html deleted.");
        } catch (err) {
            console.log("⚠️  Could not delete old index.html (might not exist):", err.message);
        }

        // Upload new index.html
        const localIndexPath = path.join(__dirname, "gaugyanworld.org/dist/index.html");
        console.log(`📤 Uploading new index.html from ${localIndexPath}...`);

        // Verify local file exists and read content
        const indexContent = fs.readFileSync(localIndexPath, 'utf8');
        console.log("📄 Local index.html content preview:");
        console.log(indexContent.substring(0, 500));

        if (!indexContent.includes('index-CUZX9qeq.js')) {
            throw new Error("❌ Local index.html does not contain the expected JS file hash!");
        }

        await client.uploadFrom(localIndexPath, "/home/gaugyanc/gaugyanworld.org/index.html");

        console.log("✅ index.html uploaded successfully!");

        // Verify upload by downloading and comparing
        console.log("🔍 Verifying upload...");
        const tempDownloadPath = path.join(__dirname, "temp_verify_index.html");
        await client.downloadTo(tempDownloadPath, "/home/gaugyanc/gaugyanworld.org/index.html");

        const uploadedContent = fs.readFileSync(tempDownloadPath, 'utf8');
        if (uploadedContent.includes('index-CUZX9qeq.js')) {
            console.log("✅ VERIFICATION PASSED: Production index.html now contains index-CUZX9qeq.js");
        } else {
            console.log("❌ VERIFICATION FAILED: Production index.html still has old content");
            console.log("First 500 chars:", uploadedContent.substring(0, 500));
        }

        // Cleanup
        fs.unlinkSync(tempDownloadPath);

    } catch (err) {
        console.error("❌ FTP ERROR:", err);
    } finally {
        client.close();
    }
}

forceUploadIndex();
