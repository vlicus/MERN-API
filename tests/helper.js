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
];

module.exports = {
    initialNotes,
    api,
};
