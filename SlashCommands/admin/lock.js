const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock the channel'),

    async execute(interaction) {
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the bot has the necessary permissions to manage channels
        if (!botMember.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'I do not have permission to manage channels.', ephemeral: true });
        }

        // Disable sending messages in the channel
        try {
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error locking the channel.', ephemeral: true });
        }

        // Create an embed for the lock message
        const lockEmbed = {
            color: 0xFF0000,
            title: 'Channel Locked',
            description: `Channel locked by ${interaction.user.tag}`,
            timestamp: new Date(),
        };

        interaction.reply({ content: 'Channel locked.', embeds: [lockEmbed] });
    }
};
