const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');

// GET

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1,
    });
    res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    await Note.findById(id)
        .then((note) => {
            if (note) {
                res.status(200).json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => {
            next(err);
        });
});

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
    const { content, important = false, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }
    if (!content) {
        return res.status(400).json({
            error: 'note.content or note is missing',
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
