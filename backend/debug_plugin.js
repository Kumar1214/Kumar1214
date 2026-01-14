const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function verifyPlugins() {
    try {
        console.log('1. Fetching Plugin List...');
        const listRes = await axios.get(`${BASE_URL}/system/plugins`);
        console.log('Plugin List:', JSON.stringify(listRes.data, null, 2));

        console.log('\n2. Testing Sample Plugin Route...');
        const sampleRes = await axios.get(`${BASE_URL}/sample`);
        console.log('Sample Response:', sampleRes.data);

    } catch (err) {
        console.error('Verification Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
}

verifyPlugins();
