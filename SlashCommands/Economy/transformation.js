const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const { Balance } = require('../../Database/Economy/coin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transformation')
        .setDescription('Transfer coins to another user')
        .addUserOption(option => option.setName('target').setDescription('User to transfer to'))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of coins to transfer')),

    async execute(interaction, client) {
        try {
            const userBalance = await Balance.findOne({ userId: interaction.user.id });

            if (!userBalance) {
                return interaction.reply('You don\'t have any coins to transfer.');
            }

            const targetUser = interaction.options.getUser('target');
            const amount = interaction.options.getInteger('amount');

            if (!targetUser || !amount || amount <= 0) {
                return interaction.reply('Invalid parameters. Please provide a valid target user and a positive amount.');
            }

            let targetBalance = await Balance.findOne({ userId: targetUser.id });
            if (!targetBalance) {
                targetBalance = new Balance({
                    userId: targetUser.id,
                    balance: 0,
                    lastClaim: null,
                });
            }

            if (userBalance.balance < amount) {
                return interaction.reply('You don\'t have enough coins for this transfer.');
            }

            userBalance.balance -= amount;
            targetBalance.balance += amount;

            await userBalance.save();
            await targetBalance.save();

            interaction.reply(`:moneybag: **You transferred :dollar: ${amount} to ${targetUser.username}.**`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your request.');
        }
    },
};
