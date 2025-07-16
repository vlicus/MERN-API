const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1,
        important: 1,
    });
    res.json(users);
});

// POST

usersRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'username and password are required',
        });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                error: 'user already exists',
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            name,
            passwordHash,
        });

        const savedUser = await user.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;
