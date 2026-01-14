const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function verifyVendorPlugin() {
    try {
        console.log('1. Fetching Plugin List...');
        const listRes = await axios.get(`${BASE_URL}/system/plugins`);
        console.log('Plugin List:', JSON.stringify(listRes.data, null, 2));

        const vendorPlugin = listRes.data.data.find(p => p.slug === 'vendor');
        if (vendorPlugin) {
            console.log('SUCCESS: Vendor Plugin found active.');
            console.log('Mount Path:', vendorPlugin.mountPath);
        } else {
            console.error('FAILURE: Vendor Plugin not found in list.');
        }

    } catch (err) {
        console.error('Verification Failed:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
}

verifyVendorPlugin();
