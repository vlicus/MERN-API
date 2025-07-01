/* const http = require("http"); */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./loggerMiddleware.js');
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

let notes = [
    {
        id: 1,
        content: 'Me tengo que suscribir a @midudev en YouTube',
        date: '2019-05-30T17:30:31.098Z',
        important: true,
    },
    {
        id: 2,
        content: 'Tengo que estudiar las clases del FullStack Bootcamp',
        date: '2019-05-30T18:39:34.091Z',
        important: false,
    },
    {
        id: 3,
        content: 'Repasar los retos de JS de midudev',
        date: '2019-05-30T19:20:14.298Z',
        important: true,
    },
    {
        id: 4,
        content: 'Ir a currar :(',
        date: '2019-05-30T19:20:14.298Z',
        important: true,
    },
];

/* const app = http.createServer((request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify(notes));
});
 */

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find((note) => note.id === id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
});

app.post('/api/notes', (req, res) => {
    const note = req.body;
    let paco;

    if (!note || !note.content) {
        return res.status(400).json({
            error: 'note.content is missing',
        });
    }

    const idNotes = notes.map((note) => note.id);

    const idMax = Math.max(...idNotes);

    const newNote = {
        id: idMax + 1,
        content: note.content,
        date: new Date().toISOString(),
        important:
            typeof note.important !== 'undefined' ? note.important : false,
    };

    notes = [...notes, newNote];

    res.status(201).json(newNote);
});

app.use(logger);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
