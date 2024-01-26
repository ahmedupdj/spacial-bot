const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: '',
    },
});

const Title = mongoose.model('Title', titleSchema);

module.exports = { Title };
