require('dotenv').config();
require('./mongo.js');
const { PORT } = process.env;
const express = require('express');
const cors = require('cors');
const notFound = require('./middlewares/notFound.js');
const handleErrors = require('./middlewares/handleErrors.js');
const usersRouter = require('./controllers/users_controller.js');
const notesRouter = require('./controllers/notes_controller.js');
const loginRouter = require('./controllers/login_controller.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static('images'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);

app.use(notFound);
app.use(handleErrors);

const server = app.listen(PORT || 3001, () => {
    console.log(`Server running on ${PORT}`);
});

module.exports = { app, server };
