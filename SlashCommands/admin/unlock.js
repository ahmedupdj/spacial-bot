const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock the channel'),

    async execute(interaction) {
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the bot has the necessary permissions to manage channels
        if (!botMember.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: 'I do not have permission to manage channels.', ephemeral: true });
        }

        // Enable sending messages in the channel
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SEND_MESSAGES: null, // Remove the overwrite
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error unlocking the channel.', ephemeral: true });
        }

        // Create an embed for the unlock message
        const unlockEmbed = {
            color: 0x00FF00,
            title: 'Channel Unlocked',
            description: `Channel unlocked by ${interaction.user.tag}`,
            timestamp: new Date(),
        };

        interaction.reply({ content: 'Channel unlocked.', embeds: [unlockEmbed] });
    }
};
