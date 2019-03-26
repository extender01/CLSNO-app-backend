const mongoose = require('mongoose');
const {CustomNoteSchema} = require('./customNote');



let TestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    where: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    syn: {
        type: String,
        required: false
    },
    nameAk: {
        type: String,
        required: false
    },
    groupAk: {
        type: String,
        required: false
    },
    whenExtTransport: {
        type: String,
        required: false
    },
    draw: {
        type: String,
        required: false
    },
    preanal: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    customNotes: [CustomNoteSchema],
    
    parcelWho: {
        type: String,
        required: false
    },
    parcelPreanal: {
        type: String,
        required: false
    },
    parcelNote: {
        type: String,
        required: false
    },
    extHowOften: {
        type: String,
        required: false
    },
    extResponse: {
        type: String,
        required: false
    },
    metodics: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    expertise: {
        type: String,
        required: false
    },
    refRange: {
        type: Array,
        required: false
    },
    rutCare: {
        type: Boolean,
        default: true
    },
    rutTime: {
        type: String,
        required: false
    },
    statCare: {
        type: Boolean,
        required: false
    },
    statTime: {
        type: String,
        required: false,
        default: '1h'
    },
    erCare: {
        type: Boolean,
        required: false
    },
    erTime: {
        type: String,
        required: false,
        default: '5h'
    },
    additionalOrder: {
        type: String,
        required: false
    },
    responseNote: {
        type: String,
        required: false
    },
    interfereDown: {
        type: String,
        required: false
    },
    interfereUp: {
        type: String,
        required: false
    },
    physVar: {
        type: String,
        required: false
    },
    bioHalfLife: {
        type: String,
        required: false
    },
    groups: {
        type: String,
        required: false
    },
    volume: {
        type: String,
        required: false
    },
    dependencies: {
        type: String,
        required: false
    },
    formula: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    },
    points: {
        type: Number,
        required: false
    },
    openLimsNumber: {
        type: Number,
        required: false
    },
    material: {
        type: String,
        required: false
    }

});






let Test = mongoose.model('Test', TestSchema);

module.exports = {Test};
