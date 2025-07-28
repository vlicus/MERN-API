const User = require('../models/User');
const Note = require('../models/Note.js');
const { api } = require('../helpers/notes_helper.js');

const getUsers = async () => {
    const usersDB = await User.find({});
    return usersDB.map((user) => user.toJSON());
};

const getTokenFromLogin = async (username, password) => {
    const result = await api.post('/api/login').send({ username, password });
    const { token } = result.body;
    return token;
};

module.exports = { getUsers, getTokenFromLogin };
