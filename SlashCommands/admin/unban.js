const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban user')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user to unban (provide user ID)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unban')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.options.getString('user');
        const reason = interaction.options.getString('reason');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        if (!botMember.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to unban members.', ephemeral: true });
        }

        // Fetch the ban list for the guild
        const banList = await interaction.guild.bans.fetch();

        // Check if the user is banned
        const bannedUser = banList.get(userId);

        if (!bannedUser) {
            return interaction.reply({ content: 'User is not banned in the server.', ephemeral: true });
        }

        try {
            // Unban the user
            await interaction.guild.bans.remove(userId, reason || 'No reason specified.');

          
            const unbanEmbed = {
                color: 0x00FF00,
                title: `User Unbanned: ${userId}`,
                description: `Unbanned by ${interaction.user.tag}`,
                fields: [
                    { name: 'Reason', value: reason || 'No reason specified.' },
                ],
                timestamp: new Date(),
            };

            interaction.reply({ embeds: [unbanEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error unbanning the user.', ephemeral: true });
        }
    }
};
