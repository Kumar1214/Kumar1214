const ftp = require("basic-ftp");
const path = require("path");

async function deployFrontend() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "148.113.35.111",
            user: "gaugyan@gaugyanworld.org",
            password: "Password@2026_GG_",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("Connected. Deploying Frontend Fix...");

        // Ensure remote dir
        await client.ensureDir("/home/gaugyanc/gaugyanworld.org");

        // Upload dist contents
        await client.uploadFromDir("gaugyanworld.org/dist", "/home/gaugyanc/gaugyanworld.org");

        console.log("✅ Frontend Successfully Deployed.");

    } catch (err) {
        console.log("FTP ERROR:", err);
    }
    client.close();
}

deployFrontend();
