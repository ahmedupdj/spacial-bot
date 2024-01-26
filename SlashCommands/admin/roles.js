const { SlashCommandBuilder, ChatInputCommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Display roles in the server'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            const guild = interaction.guild;

            // Get the roles in the server
            const roles = guild.roles.cache;

            // Create an embed to display the roles
            const rolesEmbed = {
                color: 0x0099ff, // Use a number instead of a string for color
                title: 'Roles in the Server',
                description: `Here is a list of roles in ${guild.name}`,
                fields: [{ name: 'Roles', value: roles.map(role => `<@&${role.id}>`).join(', ') }],
            };

            interaction.reply({ embeds: [rolesEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
