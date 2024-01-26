const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const { Rep } = require('../../Database/Economy/rep');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Give reputation points to another user')
        .addUserOption(option => option.setName('target').setDescription('User to give reputation points to')),

    async execute(interaction, client) {
        try {
            const giverId = interaction.user.id;
            const receiver = interaction.options.getUser('target');

            if (!receiver) {
                return interaction.reply('Please specify a valid user to give reputation points to.');
            }

            // Get or create a record for the giver
            let giverData = await Rep.findOne({ userId: giverId });

            if (!giverData) {
                giverData = new Rep({
                    userId: giverId,
                    lastRep: null,
                });
                await giverData.save();
            }

            if (giverData.lastRep && Date.now() - giverData.lastRep < 86400000) {
                return interaction.reply('You can only give reputation points once every 24 hours.');
            }

            giverData.lastRep = Date.now();
            await giverData.save();

            // Get or create a record for the receiver
            let receiverData = await Rep.findOne({ userId: receiver.id });

            if (!receiverData) {
                // If the receiver doesn't have a record, create one
                receiverData = new Rep({
                    userId: receiver.id,
                    lastRep: null,
                    repPoints: 0,
                });
            }

            receiverData.repPoints += 1;
            await receiverData.save();

            interaction.reply(`:+1: **You've given a reputation point to ${receiver.username}!**`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your request.');
        }
    },
};
