const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the bot has the necessary permissions to send messages
        if (!botMember.permissions.has('SEND_MESSAGES')) {
            return interaction.reply({ content: 'I do not have permission to send messages.', ephemeral: true });
        }

        try {
            // Send a warning message to the user in DM
            await target.send(`You have been warned in ${interaction.guild.name} for the following reason:\n${reason || 'No reason specified.'}`);

            // Create an embed for the warning message
            const warnEmbed = {
                color: 0xFFFF00,
                title: `User Warned: ${target.tag}`,
                description: `Warned by ${interaction.user.tag}`,
                fields: [
                    { name: 'Reason', value: reason || 'No reason specified.' },
                ],
                timestamp: new Date(),
            };

            interaction.reply({ content: 'User warned. A warning message has been sent to their DMs.', embeds: [warnEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error sending warning to the user.', ephemeral: true });
        }
    }
};
