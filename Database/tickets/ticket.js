const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: String,
    guildId: String,
    category: String
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
