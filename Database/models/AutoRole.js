const mongoose = require('mongoose');

const AutoRoleSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },

    isCodeEnabled: {
        type: Boolean,
        default: true,
    },

    selectedRole1: {
        type: String, 
    },
    selectedRole2: {
        type: String, 
    },
});

module.exports = mongoose.model('AutoRole', AutoRoleSchema);
