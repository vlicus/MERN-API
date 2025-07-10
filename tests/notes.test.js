const mongoose = require('mongoose');
const { server } = require('../index.js');
const { api, initialNotes } = require('./helper');
const Note = require('../models/Note.js');

beforeEach(async () => {
    await Note.deleteMany();

    const note1 = new Note(initialNotes[0]);
    await note1.save();

    const note2 = new Note(initialNotes[1]);
    await note2.save();
});

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
    const res = await api.get('/api/notes');
    expect(res.body).toHaveLength(initialNotes.length);
});

test('the first note is about Licus', async () => {
    const res = await api.get('/api/notes');
    const contents = res.body.map((note) => note.content);

    expect(contents).toContain('Aprendiendo FullStack JS con el Midudev');
});

test('A valid note can be added', async () => {
    const newNote = {
        content: 'Próximamente async/await',
        important: true,
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/notes');
    const contents = res.body.map((note) => note.content);

    expect(res.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
});

test('Note without content can not be added', async () => {
    const newNote = {
        important: true,
    };

    await api.post('/api/notes').send(newNote).expect(400);

    const res = await api.get('/api/notes');

    expect(res.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
    server.close();
    mongoose.connection.close();
});
