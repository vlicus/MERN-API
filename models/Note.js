const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
    },
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject._v;
    },
});

const Note = model('Note', noteSchema);

module.exports = Note;
