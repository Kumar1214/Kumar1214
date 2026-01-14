const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@gaugyan.com',
        password: 'password123',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'instructor@gaugyan.com',
        password: 'password123',
        role: 'instructor'
    },
    {
        name: 'Jane Doe',
        email: 'user@gaugyan.com',
        password: 'password123',
        role: 'user'
    }
];

module.exports = users;
