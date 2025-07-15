const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note', // Referencia al modelo notas
        },
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject._v;

        delete returnedObject.passwordHash;
    },
});

const User = model('User', userSchema);

module.exports = User;
