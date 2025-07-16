const User = require('../models/User');

const getUsers = async () => {
    const usersDB = await User.find({});
    return usersDB.map((user) => user.toJSON());
};

module.exports = { getUsers };
