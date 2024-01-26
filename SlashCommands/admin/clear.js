const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from the channel')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear')),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            const amount = interaction.options.getInteger('amount');

            if (amount === null || isNaN(amount) || amount <= 0) {
                return interaction.reply('Please provide a valid number of messages to clear.');
            }

            // Fetch messages from the channel
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });

            // Filter out messages older than 14 days
            const validMessages = fetchedMessages.filter(message => {
                const ageInDays = (Date.now() - message.createdTimestamp) / (1000 * 60 * 60 * 24);
                return ageInDays <= 14;
            });

            // Delete the valid messages
            await interaction.channel.bulkDelete(validMessages);

            const replyMessage = await interaction.reply(`Cleared ${validMessages.size} messages.`);

            // Delete the reply message after 5 seconds
            setTimeout(() => {
                replyMessage.delete();
            }, 5000);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
