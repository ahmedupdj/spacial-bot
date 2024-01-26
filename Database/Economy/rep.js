// Rep.js

const mongoose = require('mongoose');

const repSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    lastRep: {
        type: Date,
        default: null,
    },
    repPoints: {
        type: Number,
        default: 0,
    },
});

const Rep = mongoose.model('Rep', repSchema);

module.exports = { Rep };
