require('dotenv').config();
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;
const mongoose = require('mongoose');

const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;

// Creamos conexión con mongoDB
mongoose
    .connect(connectionString)
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Error connecting to your db', err);
    });

process.on('uncaughtException', (error) => {
    console.log(error);
    mongoose.disconnect();
});
