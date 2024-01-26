const { Schema, model } = require('mongoose');

const embeddingSchema = new Schema({
    guildId: String,
    isCodeEnabled: Boolean,
    embedData: {
        title: String,
        description: String,
        color: String,
    },
});

const Embed = model('Embed', embeddingSchema);

module.exports = Embed;
