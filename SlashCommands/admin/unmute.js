const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true)),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the bot has the necessary permissions to manage roles
        if (!botMember.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true });
        }

        // Get the mute role
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            return interaction.reply({ content: 'No mute role found.', ephemeral: true });
        }

        // Check if the target user has the mute role
        if (!target.roles.cache.has(muteRole.id)) {
            return interaction.reply({ content: 'The user is not muted.', ephemeral: true });
        }

        // Remove the mute role from the target user
        try {
            await target.roles.remove(muteRole);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error removing mute role from the user.', ephemeral: true });
        }

        // Create an embed for the unmute message
        const unmuteEmbed = {
            color: 0x00FF00,
            title: `User Unmuted: ${target.user.tag}`,
            description: `Unmuted by ${interaction.user.tag}`,
            timestamp: new Date(),
        };

        interaction.reply({ content: 'User unmuted.', embeds: [unmuteEmbed] });
    }
};
