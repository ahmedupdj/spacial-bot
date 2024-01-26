const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for ban')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        if (!botMember.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to ban members.', ephemeral: true });
        }

        const memberToBan = interaction.guild.members.cache.get(target.id);

        if (!memberToBan) {
            return interaction.reply({ content: 'Member not found in the server.', ephemeral: true });
        }

        try {
            await memberToBan.ban({ reason: reason || 'No reason specified.' });

            // Create an embed for the ban message
            const banEmbed = {
                color: 0xFF0000,
                title: `User Banned: ${target.tag}`,
                description: `Banned by ${interaction.user.tag}`,
                fields: [
                    { name: 'Reason', value: reason || 'No reason specified.' },
                ],
                timestamp: new Date(),
            };

            // Check if the interaction is still valid
            if (interaction.replied) {
                console.log('Interaction already replied to.');
            } else {
                interaction.reply({ embeds: [banEmbed] });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error banning the user.', ephemeral: true });
        }
    }
};
