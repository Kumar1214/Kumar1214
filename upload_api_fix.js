const ftp = require("basic-ftp");
const path = require("path");

async function uploadAPIFix() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🔧 Connecting to FTP...");
        await client.access({
            host: "148.113.35.111",
            user: "gaugyan@gaugyanworld.org",
            password: "Password@2026_GG_",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("✅ Connected.");

        const remotePath = "/home/gaugyanc/gaugyanworld.org";

        // Delete old index.html
        try {
            await client.remove(`${remotePath}/index.html`);
            console.log("🗑️ Deleted old index.html");
        } catch (e) { }

        // Upload new index.html
        console.log("📤 Uploading new index.html with API fix...");
        await client.uploadFrom(
            path.join(__dirname, "gaugyanworld.org/dist/index.html"),
            `${remotePath}/index.html`
        );

        // Upload new JS bundle
        console.log("📤 Uploading new JS bundle (index-CGI3mTOm.js)...");
        await client.uploadFrom(
            path.join(__dirname, "gaugyanworld.org/dist/assets/index-CGI3mTOm.js"),
            `${remotePath}/assets/index-CGI3mTOm.js`
        );

        console.log("✅ Upload complete!");
        console.log("🔍 Verifying...");

        // Download and verify
        const tempPath = path.join(__dirname, "temp_verify.html");
        await client.downloadTo(tempPath, `${remotePath}/index.html`);

        const fs = require("fs");
        const content = fs.readFileSync(tempPath, 'utf8');

        if (content.includes('index-CGI3mTOm.js')) {
            console.log("✅✅✅ VERIFIED: index.html has new hash index-CGI3mTOm.js");
        } else {
            console.log("❌ FAILED: index.html doesn't have expected hash");
        }

        fs.unlinkSync(tempPath);

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        client.close();
    }
}

uploadAPIFix();
