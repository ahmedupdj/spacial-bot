const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const { Title } = require('../../Database/Economy/title');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('title')
        .setDescription('Set or clear your title')
        .addStringOption(option => option.setName('action').setDescription('Action (set or clear)').setRequired(true))
       ,

    async execute(interaction, client) {
        //SOON
    },
};
