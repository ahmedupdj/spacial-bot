const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kick')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        if (!botMember.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
        }

        const memberToKick = interaction.guild.members.cache.get(target.id);

        if (!memberToKick) {
            return interaction.reply({ content: 'Member not found in the server.', ephemeral: true });
        }

        try {
            await memberToKick.kick(reason || 'No reason specified.');
            const kickEmbed = {
                color: 0xFF0000,
                title: `User Kicked: ${target.tag}`,
                description: `Kicked by ${interaction.user.tag}`,
                fields: [
                    { name: 'Reason', value: reason || 'No reason specified.' },
                ],
                timestamp: new Date(),
            };

            interaction.reply({ embeds: [kickEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error kicking the user.', ephemeral: true });
        }
    }
};
