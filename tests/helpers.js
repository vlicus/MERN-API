const { app } = require('../index');
const supertest = require('supertest');

const api = supertest(app);

const initialNotes = [
    {
        content: 'Aprendiendo FullStack JS con el Midudev',
        important: true,
        date: new Date(),
    },
    {
        content:
            'Aquí puedes ver mi portfolio: https://samuel-cobas-portfolio.vercel.app/',
        important: true,
        date: new Date(),
    },
    {
        content: 'Una nota nueva',
        important: true,
        date: new Date(),
    },
];

const getAllContentFromNotes = async () => {
    const res = await api.get('/api/notes');
    return {
        contents: res.body.map((note) => note.content),
        res,
    };
};

module.exports = {
    initialNotes,
    api,
    getAllContentFromNotes,
};
