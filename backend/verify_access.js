const axios = require('axios');

async function testAccess() {
    try {
        console.log("1. Logging in...");
        const loginRes = await axios.post('http://localhost:5001/api/v1/auth/login', {
            email: 'admin@gaugyan.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log("Login Success. Token:", token ? "Received" : "Missing");

        if (!token) return;

        console.log("\n2. Fetching AI Summary...");
        try {
            const summaryRes = await axios.get('http://localhost:5001/api/admin/ai-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("AI Summary Response Status:", summaryRes.status);
            console.log("AI Summary Data:", JSON.stringify(summaryRes.data, null, 2));
        } catch (err) {
            console.error("AI Summary Failed:", err.response?.status, err.response?.data);
        }

    } catch (error) {
        console.error("Login Failed:", error.response?.status, error.response?.data);
    }
}

testAccess();
