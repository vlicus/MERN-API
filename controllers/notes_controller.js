const notesRouter = require('express').Router();
const Note = require('../models/Note');

// GET

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({});
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
    const note = req.body;

    if (!note.content) {
        return res.status(400).json({
            error: 'note.content or note is missing',
        });
    }

    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false,
    });

    try {
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        next(error);
    }
});
module.exports = notesRouter;
