const mongoose = require('mongoose');
const { server } = require('../index.js');
const {
    api,
    initialNotes,
    getAllContentFromNotes,
} = require('../helpers/notes_helper.js');
const Note = require('../models/Note.js');

beforeEach(async () => {
    await Note.deleteMany();

    // Paralelo, no controrlamos el orden en el que se guardan las notas en la base de datos
    /* const notesObjects = initialNotes.map((note) => new Note(note));
    const promises = notesObjects.map((note) => note.save());
    Promise.all(promises); */

    // Secuencial, se guardan en orden (ver las notas helpers/notes.js)
    for (let note of initialNotes) {
        const noteObject = new Note(note);
        await noteObject.save();
    }
});

describe('GET notes', () => {
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

    test('the first note is about Midudev', async () => {
        const { contents } = await getAllContentFromNotes();

        expect(contents).toContain('Aprendiendo FullStack JS con el Midudev');
    });
});

describe('POST notes', () => {
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

        const { contents, res } = await getAllContentFromNotes();

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
});

describe('DELETE notes', () => {
    test('A note can be deleted', async () => {
        const { res: firstResponse } = await getAllContentFromNotes();
        const { body: notes } = firstResponse;
        const noteToDelete = notes[0];

        await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

        const { contents, res: secondResponse } =
            await getAllContentFromNotes();

        expect(secondResponse.body).toHaveLength(initialNotes.length - 1);

        expect(contents).not.toContain(noteToDelete.content);
    });

    test('A note that do not exist can not be deleted', async () => {
        await api.delete(`/api/notes/1234`).expect(400);

        const { res } = await getAllContentFromNotes();

        expect(res.body).toHaveLength(initialNotes.length);
    });
});

afterAll(() => {
    server.close();
    mongoose.connection.close();
});
