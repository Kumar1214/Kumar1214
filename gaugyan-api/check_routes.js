const http = require('http');

const endpoints = [
    '/api/courses',
    '/api/exams',
    '/api/quizzes',
    '/api/podcasts',
    '/api/news',
    '/api/v1/content/knowledgebase',
    '/api/products',
    '/api/users',
    '/api/gaushalas',
    '/api/cows',
    '/api/music',
    '/api/meditation'
];

const checkEndpoint = (path) => {
    return new Promise((resolve) => {
        const req = http.get({
            hostname: 'localhost',
            port: 5001,
            path: path,
            timeout: 2000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({ path, status: res.statusCode, body: data.substring(0, 100) });
            });
        });

        req.on('error', (e) => {
            resolve({ path, status: 'ERROR', error: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ path, status: 'TIMEOUT' });
        });
    });
};

(async () => {
    console.log('Checking Endpoints...');
    for (const ep of endpoints) {
        const result = await checkEndpoint(ep);
        console.log(`${result.path}: ${result.status} ${result.status === 200 ? 'OK' : 'FAIL'} (${result.body || result.error || ''})`);
    }
})();
