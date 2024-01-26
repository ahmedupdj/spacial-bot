const mongoose = require('mongoose');

const protectionSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    isCodeEnabled: {
        type: Boolean,
        default: false,
    },
    isLinkProtectionEnabled: {
        type: Boolean,
        default: false,
    },
    allowedLinkChannelId: {
        type: String,
        default: null,
    },
    isAntiBotEnabled: {
        type: Boolean,
        default: false,
    },
    allowedBotIds: {
        type: [String],
        default: [],
    },
});

const ProtectionModel = mongoose.model('Protection', protectionSchema);

module.exports = ProtectionModel;
