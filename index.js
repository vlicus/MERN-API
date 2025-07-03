require('dotenv').config();
require('./mongo.js');
const { PORT } = process.env;
/* const Sentry = require('@sentry/node');
require('./instrument.js'); */
const express = require('express');
const cors = require('cors');
const Note = require('./models/Note.js');
const notFound = require('./middlewares/notFound.js');
const handleErrors = require('./middlewares/handleErrors.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

/* Sentry.init({
    dsn: 'https://c7011a44068d21411ab6f410f7f8e580@o4509606362087424.ingest.de.sentry.io/4509606364053584',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
}); */

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

app.get('/api/notes/:id', (req, res, next) => {
    const { id } = req.params;

    Note.findById(id)
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

app.put('/api/notes/:id', (req, res, next) => {
    const { id } = req.params;
    const note = req.body;

    const newNoteInfo = {
        content: note.content,
        important: note.important,
    };
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((result) => {
        res.json(result);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    Note.findByIdAndDelete(id)
        .then((result) => {
            console.log(
                `Nota con id: ${result._id} ha sido borrada correctamente`
            );
            res.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
    res.status(204).end();
});

app.post('/api/notes', (req, res) => {
    const note = req.body;

    if (!note || !note.content) {
        return res.status(400).json({
            error: 'note.content or note is missing',
        });
    }

    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false,
    });

    newNote.save().then((savedNote) => {
        console.log(
            `Nota con id: ${savedNote.id} ha sido creada correctamente`
        );
        res.status(201).json(savedNote);
    });
});

/* Sentry.setupExpressErrorHandler(app);
// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
}); */

app.use(notFound);
app.use(handleErrors);

app.listen(PORT || 3001, () => {
    console.log(`Server running on ${PORT}`);
});
