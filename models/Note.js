const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject._v;
    },
});

const Note = model('Note', noteSchema);

/* const note = new Note({
    content: 'Licus está practicando MongoDB desde una relación modelo-esquema',
    date: new Date(),
    important: true,
});

note.save()
    .then((result) => {
        console.log(result);
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(`Error ${err}`);
    }); */

module.exports = Note;
