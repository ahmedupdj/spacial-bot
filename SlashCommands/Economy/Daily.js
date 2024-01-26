const { SlashCommandBuilder } = require('discord.js');
const { Balance } = require('../../Database/Economy/coin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Give you coins'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const timeout = 86400000;

            const amount = Math.floor(Math.random() * 1000) + 1;
            let userBalance = await Balance.findOne({ userId });
            if (!userBalance) {
                userBalance = new Balance({
                    userId,
                    balance: 0,
                    lastClaim: null,
                });
            }

            if (userBalance.lastClaim && Date.now() - userBalance.lastClaim < timeout) {
                const timeRemaining = timeout - (Date.now() - userBalance.lastClaim);
                const hours = Math.floor(timeRemaining / 3600000);
                const minutes = Math.floor((timeRemaining % 3600000) / 60000);
                const seconds = Math.floor((timeRemaining % 60000) / 1000);

                return interaction.reply(`:rolling_eyes: **| ${interaction.user.username}, your daily credits refreshes in ${hours}h ${minutes}m ${seconds}s.**`);
            }

            userBalance.balance += amount;
            userBalance.lastClaim = Date.now();
            await userBalance.save();

            interaction.reply(`:moneybag: **${interaction.user.username}, you got :dollar: ${amount} daily credits!**`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your claim.');
        }
    }
};
