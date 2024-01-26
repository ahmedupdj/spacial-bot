const { SlashCommandBuilder, ChatInputCommandInteraction, Client, MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Get user information')
        .addUserOption(option => option.setName('user').setDescription('User to get information about')),
    /**
     * @param {ChatInputCommandInteraction} Interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            // Get the user mentioned in the 'target' option, or use the user who sent the command if not mentioned
            const user = interaction.options.getUser('user') || interaction.user;

            // Now you have the 'user' variable which represents the mentioned user or the user who sent the command
            const userInfoEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('User Information')
                .setDescription(`Information for ${user.tag}`)
                .addFields(
                    { name: 'Username', value: user.username },
                    { name: 'ID', value: user.id },
                    { name: 'Avatar', value: `[Click Here](${user.displayAvatarURL()})` }, // Display the avatar with a clickable link
                    { name: 'Joined Discord', value: user.createdAt.toDateString() },
                    { name: 'Joined Server', value: interaction.guild.members.cache.get(user.id).joinedAt.toDateString() },
                    // Add more fields as needed
                );

            interaction.reply({ embeds: [userInfoEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
