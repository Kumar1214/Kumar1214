const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const AUTH_URL = 'http://localhost:5001/api/v1/auth';

let adminToken = '';
let learnerToken = '';

const login = async (email, password) => {
    try {
        const res = await axios.post(`${AUTH_URL}/login`, { email, password });
        return res.data.token;
    } catch (error) {
        console.error(`Login Failed for ${email}:`, error.response?.data?.message || 'Unknown Error');
        return null;
    }
};

const runTest = async () => {
    console.log('=== TESTING RESULTS PERSISTENCE & RETRIEVAL ===');

    // Need valid users. reset_admin_password ensured admin works.
    // test_learner might not exist if DB reset, so let's try to register/login again cleanly.

    adminToken = await login('admin@gaugyan.com', 'password123'); // Should be 'password123' from reset script

    // Register Learner
    try {
        await axios.post(`${AUTH_URL}/register`, {
            name: 'Result Tester',
            firstName: 'Result',
            lastName: 'Tester',
            email: 'result_tester@example.com',
            password: 'password123',
            role: 'user'
        });
    } catch (e) { /* Ignore exists */ }

    learnerToken = await login('result_tester@example.com', 'password123');

    if (!adminToken || !learnerToken) {
        console.error('Auth failed. Aborting. Admin:', !!adminToken, 'Learner:', !!learnerToken);
        return;
    }

    // 2. Get Quizzes
    try {
        let quizzesRes = await axios.get(`${API_URL}/quizzes`);
        let quiz = quizzesRes.data[0];

        if (!quiz) {
            console.log('No quizzes found. Creating dummy quiz...');
            const createRes = await axios.post(`${API_URL}/quizzes`, {
                title: 'Backend Test Quiz',
                category: 'Testing',
                difficulty: 'Easy',
                questions: [
                    { id: 1, text: 'Q1', options: ['A', 'B'], correctAnswer: 'A', points: 10 },
                    { id: 2, text: 'Q2', options: ['C', 'D'], correctAnswer: 'D', points: 10 }
                ]
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            quiz = createRes.data.data;
        }

        console.log(`Using Quiz: ${quiz.title} (ID: ${quiz.id})`);

        // 3. Submit Attempt
        console.log('Submitting Attempt...');
        const submitRes = await axios.post(`${API_URL}/quizzes/${quiz.id}/submit`, {
            answers: [
                { questionId: 1, selectedOption: 'A' }, // Correct
                { questionId: 2, selectedOption: 'C' }  // Wrong
            ]
        }, { headers: { Authorization: `Bearer ${learnerToken}` } });

        const result = submitRes.data.data;
        console.log('Submission Result:', result.score === 10 ? 'PASSED' : 'FAILED');

        // 4. Verify Retrieval (GET /my-results)
        console.log('Verifying GET /my-results...');
        const historyRes = await axios.get(`${API_URL}/quizzes/my-results`, {
            headers: { Authorization: `Bearer ${learnerToken}` }
        });

        const history = historyRes.data.data;
        if (Array.isArray(history) && history.length > 0 && history[0].itemId === quiz.id) {
            console.log(`✅ Retrieval SUCCESS. Found ${history.length} records.`);
            console.log('Last Record:', history[0].title, history[0].score);
        } else {
            console.error('❌ Retrieval FAILED. History:', history);
        }

    } catch (error) {
        console.error('Test Error:', error.response?.data || error.message);
    }
};

runTest();
