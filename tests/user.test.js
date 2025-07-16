const User = require('../models/User');
const mongoose = require('mongoose');
const { server } = require('../index.js');
const bcrypt = require('bcrypt');
const { api } = require('../helpers/notes.js');
const { getUsers } = require('../helpers/users.js');

describe.only('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('password', 10);
        const user = new User({ username: 'Licusroot', passwordHash });

        await user.save();
    });

    test('works as expected, creating a fresh username', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'LicusDev',
            name: 'Samuel',
            password: 'Password',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await getUsers();

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map((user) => user.username);
        expect(usernames).toContain(newUser.username);
    });

    afterAll(() => {
        server.close();
        mongoose.connection.close();
    });
});
