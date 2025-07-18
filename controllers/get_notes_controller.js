const getNotesRouter = require('express').Router();
const Note = require('../models/Note');

// GET

getNotesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1,
    });
    res.json(notes);
});

getNotesRouter.get('/:id', async (req, res, next) => {
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

module.exports = getNotesRouter;
