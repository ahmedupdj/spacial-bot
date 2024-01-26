const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    welcomeChannel: {
        type: String,
        default: null,
    },
    welcomeMessage: {
        type: String,
        default: 'Welcome to the server, [user]!',
    },
    isCodeEnabled: {
        type: Boolean,
        default: true,
    },

    leaveChannel: {
        type: String,
        default: null,
    },
    leaveMessage: {
        type: String,
        default: 'By, [user]!',
    },
    isCodeEnabledLeave: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);
