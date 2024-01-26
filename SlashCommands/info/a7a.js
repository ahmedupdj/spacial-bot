const { ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, ChatInputCommandInteraction, Client, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button').setDescription('a7a.hs'),
    /**
     * @param {ChatInputCommandInteraction} Interaction
     * @param {Client} client
     */
    async execute(Interaction, client) {
        try {
            const buttons = new ButtonBuilder()
                .setCustomId('1234')
                .setLabel('Button1')
                .setEmoji({ name: '✅' })
                .setStyle(ButtonStyle.Primary);
            const buttons2 = new ButtonBuilder()
                .setCustomId('12345')
                .setLabel('Button2')
                .setEmoji({ name: '✅' })
                .setStyle(ButtonStyle.Success);

            const actionRow = new ActionRowBuilder()
                .addComponents(buttons, buttons2);

            await Interaction.reply({ content: 'Buttons are ready!', components: [actionRow] });
        } catch (error) {
            console.error(error);
        }
    }
}