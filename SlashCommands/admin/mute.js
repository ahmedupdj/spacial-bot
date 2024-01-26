const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute user for a specified duration')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of mute (e.g., 1h, 30m)')
                .setRequired(false)) // Make the duration option not required
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for mute')
                .setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const durationString = interaction.options.getString('duration');

        let duration = 0;
        if (durationString) {
            duration = ms(durationString);
            if (isNaN(duration)) {
                return interaction.reply({ content: 'Invalid duration format.', ephemeral: true });
            }
        }

        const reason = interaction.options.getString('reason');
        const botMember = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the bot has the necessary permissions to manage roles
        if (!botMember.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true });
        }

        // Get the mute role (create it if not exists)
        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#808080',
                    permissions: [],
                });

                // Apply the mute role to all channels
                interaction.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: 'Error creating the mute role.', ephemeral: true });
            }
        }

        // Apply the mute role to the target user
        try {
            await target.roles.add(muteRole);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error applying mute role to the user.', ephemeral: true });
        }

        // Schedule the removal of the mute role after the specified duration
        if (duration > 0) {
            setTimeout(async () => {
                try {
                    await target.roles.remove(muteRole);
                } catch (error) {
                    console.error(error);
                }
            }, duration);
        }

        // Create an embed for the mute message
        const muteEmbed = {
            color: 0xFF0000,
            title: `User Muted: ${target.user.tag}`,
            description: `Muted by ${interaction.user.tag}${duration > 0 ? ` for ${ms(duration, { long: true })}` : ''}`,
            fields: [
                { name: 'Reason', value: reason || 'No reason specified.' },
            ],
            timestamp: new Date(),
        };

        interaction.reply({ content: `User${duration > 0 ? ` muted for ${ms(duration, { long: true })}` : ''}.`, embeds: [muteEmbed] });
    }
};
