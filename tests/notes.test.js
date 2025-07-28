const mongoose = require('mongoose');
const { server } = require('../index.js');
const {
    api,
    initialNotes,
    getAllContentFromNotes,
} = require('../helpers/notes_helper.js');
const Note = require('../models/Note.js');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const { getTokenFromLogin } = require('../helpers/users_helper.js');

let token = '';

beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});

    // Creamos un usuario y lo logueamos para el test

    /* const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({
        username: 'testuser_notes',
        name: 'Test User',
        passwordHash,
    });
    await user.save(); */

    await api.post('/api/users').send({
        username: 'testuser_notes',
        name: 'Note Tester',
        password: 'testpassword_notes',
    });

    //Logueamos el test user

    token = await getTokenFromLogin('testuser_notes', 'testpassword_notes');

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
        const passwordHash = await bcrypt.hash('sekret', 10);

        const user = new User({
            username: 'testuser',
            name: 'Test Name',
            passwordHash,
        });

        const savedUser = await user.save();

        const newNote = {
            content: 'Próximamente async/await',
            important: true,
            userId: savedUser._id,
        };

        await api
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
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

        await api
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(newNote)
            .expect(400);

        const res = await api.get('/api/notes');

        expect(res.body).toHaveLength(initialNotes.length);
    });
});

describe('DELETE notes', () => {
    test('A note can be deleted', async () => {
        const { res: firstResponse } = await getAllContentFromNotes();
        const { body: notes } = firstResponse;
        const noteToDelete = notes[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);

        const { contents, res: secondResponse } =
            await getAllContentFromNotes();

        expect(secondResponse.body).toHaveLength(initialNotes.length - 1);

        expect(contents).not.toContain(noteToDelete.content);
    });

    test('A note that do not exist can not be deleted', async () => {
        await api
            .delete(`/api/notes/1234`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);

        const { res } = await getAllContentFromNotes();

        expect(res.body).toHaveLength(initialNotes.length);
    });
});

afterAll(() => {
    server.close();
    mongoose.connection.close();
});
