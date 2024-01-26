const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Show the avatar of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to show the avatar for')
                .setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarEmbed = {
            color: 0x0099ff,
            title: `Avatar of ${user.tag}`,
            image: {
                url: user.displayAvatarURL({ dynamic: true, size: 4096 }),
            },
        };

        interaction.reply({ embeds: [avatarEmbed] });
    },
};
