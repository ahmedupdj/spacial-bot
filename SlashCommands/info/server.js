const { SlashCommandBuilder, ChatInputCommandInteraction, Client, MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get server information'),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            const guild = interaction.guild;

            // Fetch the owner of the guild
            const owner = await guild.fetchOwner();
            const ownerMention = owner ? owner.user.toString() : 'Owner information not available';

            // Create an embed to display server information
            const serverInfoEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Server Information')
                .setDescription(`Here is some information about the server ${guild.name}`)
                .addFields(
                    { name: 'Server Name', value: guild.name },
                    { name: ':id:Server ID', value: guild.id },
                    { name: ':crown:Owner', value: ownerMention },
                    { name: ':busts_in_silhouette: Member Count', value: guild.memberCount.toString() },
                    { name: ':calendar: Creation Date', value: guild.createdAt.toLocaleDateString('en-US') },
                    { name: ':slight_smile: Emoji Count', value: guild.emojis.cache.size.toString() },
                    { name: ':speech_balloon:Channel Count', value: guild.channels.cache.size.toString() },
                    { name: ':sparkles:Boost Count', value: guild.premiumSubscriptionCount.toString() },
                );

            interaction.reply({ embeds: [serverInfoEmbed] });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
