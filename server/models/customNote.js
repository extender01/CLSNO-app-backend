const mongoose = require('mongoose');

//======= SCHEMA =============

let CustomNoteSchema = new mongoose.Schema ({
    department: {
        type: String
    },
    customNote: {
        type: String
    }
});

let CustomNote = mongoose.model('CustomNote', CustomNoteSchema);

module.exports = {CustomNote, CustomNoteSchema};