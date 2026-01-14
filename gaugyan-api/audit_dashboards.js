const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const AUTH_URL = 'http://localhost:5001/api/v1/auth';

let adminToken = '';
let learnerToken = '';

const login = async (email, password, role) => {
    try {
        console.log(`[${role}] Logging in as ${email}...`);
        const res = await axios.post(`${AUTH_URL}/login`, { email, password });
        if (res.data.success || res.data.token) {
            console.log(`[${role}] Login Success!`);
            return res.data.token;
        }
    } catch (error) {
        console.error(`[${role}] Login Failed:`, error.response?.status, error.response?.data?.error || error.message);
        return null;
    }
};

const checkEndpoint = async (label, method, url, token) => {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios[method](`${API_URL}${url}`, method === 'get' ? config : { ...config, ...token });

        const status = res.status;
        const data = res.data;
        // Handle different response structures (data.data array vs direct array vs object)
        const count = Array.isArray(data.data) ? data.data.length
            : (Array.isArray(data) ? data.length
                : (data.results ? data.results.length : (data.articles ? data.articles.length : 'Object')));

        console.log(`[${label}] ${method.toUpperCase()} ${url} -> ${status} OK (Items: ${count})`);
        return true;
    } catch (error) {
        console.error(`[${label}] ${method.toUpperCase()} ${url} -> FAILED: ${error.response?.status || error.message}`);
        return false;
    }
};

const runAudit = async () => {
    console.log('=== STARTING DASHBOARD API AUDIT ===\n');

    // 1. Admin Audit
    adminToken = await login('admin@gaugyan.com', 'password123', 'ADMIN');
    if (adminToken) {
        await checkEndpoint('ADMIN', 'get', '/users', adminToken);
        await checkEndpoint('ADMIN', 'get', '/products', adminToken);
        await checkEndpoint('ADMIN', 'get', '/orders', adminToken);
        await checkEndpoint('ADMIN', 'get', '/news', adminToken);
    } else {
        console.error('[ADMIN] FATAL: Admin Login failed. Cannot proceed with Admin Audit.');
    }

    console.log('\n------------------------------------------------\n');

    // 2. Learner Audit
    const learnerEmail = 'test_learner@example.com';
    const learnerPass = 'password123';

    // Register first (Idempotent: ignore if already exists)
    try {
        console.log('[LEARNER] Attempting Registration...');
        await axios.post(`${AUTH_URL}/register`, {
            name: 'Test Learner', // Use 'name' or 'firstName/lastName' depending on API
            firstName: 'Test',
            lastName: 'Learner',
            email: learnerEmail,
            password: learnerPass,
            role: 'user',
            mobile: '1234567890'
        });
        console.log('[LEARNER] Registration Success!');
    } catch (err) {
        if (err.response?.status === 400 && (err.response?.data?.error?.includes('exists') || err.response?.data?.message?.includes('exists'))) {
            console.log('[LEARNER] User already exists. Proceeding to Login.');
        } else {
            console.log(`[LEARNER] Registration Warning: ${err.message}`, err.response?.data);
        }
    }

    learnerToken = await login(learnerEmail, learnerPass, 'LEARNER');

    if (learnerToken) {
        await checkEndpoint('LEARNER', 'get', '/v1/auth/me', learnerToken);
        await checkEndpoint('LEARNER', 'get', '/courses', learnerToken);
        await checkEndpoint('LEARNER', 'get', '/orders', learnerToken);
        await checkEndpoint('LEARNER', 'get', '/v1/wallet/me', learnerToken);

        // Gap Check: Results
        console.log('[GAP CHECK] Checking for Missing Results API...');
        await checkEndpoint('LEARNER (GAP)', 'get', '/results', learnerToken);
        await checkEndpoint('LEARNER (GAP)', 'get', '/users/results', learnerToken);
    } else {
        console.log('Skipping Learner Audit due to Login Failure.');
    }

    console.log('\n=== AUDIT COMPLETE ===');
};

runAudit();
