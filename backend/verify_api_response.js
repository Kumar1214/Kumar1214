const axios = require('axios');

const verifyApi = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
            email: 'admin@gaugyan.com',
            password: 'Password@123'
        });

        const token = loginRes.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        console.log('Fetching users...');
        const usersRes = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Status:', usersRes.status);
        console.log('Data Type:', Array.isArray(usersRes.data) ? 'Array' : typeof usersRes.data);
        console.log('Data Preview:', JSON.stringify(usersRes.data).substring(0, 200));

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

verifyApi();
