
const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const ServerSettings = require('../../Database/models/welcomeSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Set the welcome channel and message')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to set as the welcome channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The welcome message with [user] as a placeholder')
                .setRequired(false)),

    async execute(Interaction, client) {
        const newWelcomeChannel = Interaction.options.getChannel('channel');
        const newWelcomeMessage = Interaction.options.getString('message') || 'Welcome to the server, [user]!';
        const guildId = Interaction.guild.id;

        await ServerSettings.findOneAndUpdate(
            { guildId },
            { $set: { welcomeChannel: newWelcomeChannel.id, welcomeMessage: newWelcomeMessage } },
            { upsert: true }
        );

        Interaction.reply(`Welcome channel set to <#${newWelcomeChannel.id}> and welcome message updated.`);
    }
};
