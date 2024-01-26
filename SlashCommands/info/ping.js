const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping').setDescription('ping bot'),
    /**
     * @param {ChatInputCommandInteraction} Interaction
     * @param {Client} client
     */

    async execute(Interaction, client) {
        await Interaction.reply({ content: `bot ping ${client.ws.ping}` })
    }
}