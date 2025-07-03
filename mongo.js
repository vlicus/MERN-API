require('dotenv').config();
const { MONGODB_PASSWORD } = process.env;
const mongoose = require('mongoose');

const connectionString = `mongodb+srv://mongodb_admin:${MONGODB_PASSWORD}@cluster0.wz4lew0.mongodb.net/?retryWrites=true&w=majority`;

// Creamos conexión con mongoDB
mongoose
    .connect(connectionString, { dbName: 'licusdb' })
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Error connecting to your db', err);
    });
