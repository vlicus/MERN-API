const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'username or password are required to login',
        });
    }
    const user = await User.findOne({ username });

    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid user or password',
        });
    }

    const userForToken = {
        id: user._id,
        username: user.username,
    };

    const token = jwt.sign(userForToken, JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 30,
    });

    res.send({
        name: user.name,
        username: user.username,
        token,
    });
});

module.exports = loginRouter;
