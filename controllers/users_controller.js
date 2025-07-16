const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});

module.exports = usersRouter;
