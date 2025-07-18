const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');

// PUT

notesRouter.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const note = req.body;

    const newNoteInfo = {
        content: note.content,
        important: note.important,
    };
    await Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(
        (result) => {
            res.status(200).json(result);
        }
    );
});

// DELETE

notesRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    await Note.findByIdAndDelete(id);
    res.status(204).end();
});

// POST

notesRouter.post('/', async (req, res, next) => {
    const { content, important = false } = req.body;

    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }
    if (!req.body) {
        return res.status(404).json({
            error: 'req.body is missing',
        });
    }
    if (!content) {
        return res.status(400).json({
            error: 'note.content is missing',
        });
    }

    const newNote = new Note({
        content,
        date: new Date(),
        important,
        user: user._id,
    });

    try {
        const savedNote = await newNote.save();

        user.notes = user.notes.concat(savedNote._id);
        await user.save();

        res.status(201).json(savedNote);
    } catch (error) {
        next(error);
    }
});

module.exports = notesRouter;
