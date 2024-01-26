const Discord = require('discord.js');
const { token } = require("./config.json")
const client = new Discord.Client({
    intents: [
        Object.keys(Discord.GatewayIntentBits)
    ],
});

const fs = require('fs');

client.SlashCommands = new Discord.Collection();
fs.readdirSync("./handlers").forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
module.exports.Client = client;

const ServerSettings = require('./Database/models/welcomeSettings');

client.on('guildMemberAdd', async (member) => {
    try {
        const serverSettings = await ServerSettings.findOne({ guildId: member.guild.id });

        if (serverSettings && serverSettings.welcomeChannel && serverSettings.isCodeEnabled) {
            const welcomeChannel = await client.channels.fetch(serverSettings.welcomeChannel);

            if (welcomeChannel && welcomeChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
                // Fetch the audit logs for the guild to get information about the inviter
                const auditLogs = await member.guild.fetchAuditLogs({ type: 24, limit: 1 });
                const inviteLog = auditLogs.entries.first();

                // Check if an invite log entry exists
                if (inviteLog) {
                    const inviterId = inviteLog.executor.id;
                    const inviter = member.guild.members.cache.get(inviterId);

                    if (inviter) {
                        // Fetch the invites for the guild
                        const invites = await member.guild.invites.fetch(); // تحديث هنا

                        // Get the number of invites by the inviter
                        const inviteCount = invites.filter((invite) => invite.inviter && invite.inviter.id === inviter.id).size;

                        // Update the welcome message to include the invite count
                        const welcomeMessage = serverSettings.welcomeMessage
                            .replace('[username]', member.user.username)
                            .replace('[user]', member.toString())
                            .replace('[server]', member.guild.name)
                            .replace('[memberCount]', member.guild.memberCount.toString())
                            .replace('[inviter]', inviter.toString())
                            .replace('[invites]', inviteCount.toString());

                        welcomeChannel.send(welcomeMessage);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});






client.on('guildMemberRemove', async (member) => {
    try {
        const serverSettings = await ServerSettings.findOne({ guildId: member.guild.id });

        if (serverSettings && serverSettings.leaveChannel && serverSettings.isCodeEnabledLeave) {
            const leaveChannel = await client.channels.fetch(serverSettings.leaveChannel);

            if (leaveChannel && leaveChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
                const leaveMessage = serverSettings.leaveMessage
                    .replace('[username]', member.user.username)
                    .replace('[user]', member.toString())
                    .replace('[server]', member.guild.name)
                    .replace('[memberCount]', member.guild.memberCount.toString());

                leaveChannel.send(leaveMessage);
            }
        }
    } catch (error) {
        console.error('Error sending leave message:', error);
    }
});





const AutoRoleModel = require('./Database/models/AutoRole');

client.on('guildMemberAdd', async (member) => {
    try {
        // Assuming you store the guild ID in your AutoRoleModel
        const guildId = member.guild.id;

        // Retrieve AutoRole data for the guild
        const autoRoleData = await AutoRoleModel.findOne({ guildId });

        if (autoRoleData && autoRoleData.isCodeEnabled && autoRoleData.selectedRole) {
            const roleId = autoRoleData.selectedRole;

            // Check if the role exists in the guild
            const role = member.guild.roles.cache.get(roleId);

            if (role) {
                // Check if the member is not the bot
                if (member.user.bot) {
                    console.log(`Bot joined, skipping role assignment`);
                } else {
                    // Assign the role to the new member
                    await member.roles.add(role);
                    console.log(`Assigned role ${role.name} to ${member.user.tag}`);
                }
            } else {
                console.error(`Role with ID ${roleId} not found in the guild`);
            }
        } else {
            console.log(`Role assignment is not enabled or selected role is not specified.`);
        }
    } catch (error) {
        console.error('Error assigning auto role:', error);
    }
});




client.on('guildMemberAdd', async (member) => {
    try {
        // Check if the added member is the bot itself
        if (member.user.bot) {
            // Assuming you store the guild ID in your AutoRoleModel
            const guildId = member.guild.id;

            // Retrieve AutoRole data for the guild
            const autoRoleData = await AutoRoleModel.findOne({ guildId });

            if (autoRoleData && autoRoleData.isCodeEnabled && autoRoleData.selectedRole2) {
                const roleId = autoRoleData.selectedRole2;

                const role = member.guild.roles.cache.get(roleId);

                if (role) {
                    await member.roles.add(role);
                    console.log(`Assigned role ${role.name} to the bot (${member.user.tag})`);
                } else {
                    console.error(`Role with ID ${roleId} not found in the guild`);
                }
            } else {
                console.log(`Role assignment is not enabled or Selected Role 2 is not specified for the bot.`);
            }
        }
    } catch (error) {
        console.error('Error assigning role to the bot:', error);
    }
});



const Logging = require('./Database/models/log');

const moment = require('moment'); // تأكد من تثبيت مكتبة moment إذا لم تكن قد قمت بذلك

const welcomedMembers = new Map();

client.on('guildMemberAdd', async (member) => {

    const logSettings = await Logging.findOne({ guildId: member.guild.id });
    const welcomeChannelId = logSettings?.welcomeChannelLog;
    const welcomeEmbedColor = logSettings?.welcomeEmbedColor || '#000000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledwelcome = logSettings?.isCodeEnabledwelcome || false;

    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    // Check if both isCodeEnabled and isCodeEnabledwelcome are true before sending the welcome message
    if (welcomeChannel && isCodeEnabled && isCodeEnabledwelcome && !welcomedMembers.get(member.id)) {
    

        const accountCreationDate = moment(member.user.createdAt).format('dddd, MMMM Do YYYY');

        const welcomeEmbedOptions = {
            color: parseInt(welcomeEmbedColor.slice(1), 16),
            title: `:inbox_tray: Member Joined`,
            description: ` ${member} (**${member.user.tag}**) joined the server.\nAccount created on ${accountCreationDate}`,
            footer: {
                text: member.guild.name,
                iconURL: member.guild.iconURL(),
            },
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        welcomeChannel.send({ embeds: [welcomeEmbedOptions] });
        console.log('Debug: isCodeEnabledWelcome:', isCodeEnabledwelcome);

        welcomedMembers.set(member.id, true);
    }
});


client.on('guildMemberRemove', async (member) => {

    const logSettings = await Logging.findOne({ guildId: member.guild.id });
    const leaveChannelId = logSettings?.LeaveChannelLog;
    const leaveEmbedColor = logSettings?.LeaveEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledLeave = logSettings?.isCodeEnabledLeave || false;

    const leaveChannel = member.guild.channels.cache.get(leaveChannelId);

    // Check if isCodeEnabledLeave is true before sending the leave message
    if (leaveChannel && isCodeEnabled && isCodeEnabledLeave) {

        const leaveEmbedOptions = {
            color: parseInt(leaveEmbedColor.slice(1), 16),
            title: `:outbox_tray: Member Left`,
            description: ` ${member} (**${member.user.tag}**) left the server.`,
            footer: {
                text: member.guild.name,
                iconURL: member.guild.iconURL(),
            },
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        leaveChannel.send({ embeds: [leaveEmbedOptions] });
    }
});
client.on('guildBanAdd', async (member) => {
    const logSettings = await Logging.findOne({ guildId: member.guild.id });
    const bannedChannelId = logSettings?.BannedChannelLog;
    const bannedEmbedColor = logSettings?.BannedEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledBanned = logSettings?.isCodeEnabledBanned || false;
  
    // Fetch audit logs with the correct type
    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 22 }); // استخدم الرقم 22 بدلاً من 'MEMBER_BAN_ADD'
    const audit = auditLogs.entries.first();
    
    if (!audit) {
      console.error('Error fetching audit log for ban.');
      return;
    }
  
    const { executor } = audit;
    const BannedChannel = member.guild.channels.cache.get(bannedChannelId);
    const name = member.user;
  
    // Check if isCodeEnabledBanned is true before sending the ban message
    if (BannedChannel && isCodeEnabled && isCodeEnabledBanned) {
      // تكوين الرسالة Embed
      const leaveEmbedOptions = {
        color: parseInt(bannedEmbedColor.slice(1), 16),
        title: `:airplane: Member Ban`,
        description: `${name} (**${member.user.tag}**) Banned the server.`,
        fields: [
          { name: 'Responsible Moderator', value: `${executor} (${executor.id})` },
        ],
        footer: {
          text: member.guild.name,
          iconURL: member.guild.iconURL(),
        },
        thumbnail: {
          url: member.user.displayAvatarURL({ dynamic: true }),
        },
        timestamp: new Date(),
      };
  
      // إرسال الرسالة إلى قناة السجل المحظورة
      BannedChannel.send({ embeds: [leaveEmbedOptions] })
        .then(() => console.log('Ban message sent successfully'))
        .catch(error => console.error('Error sending ban message:', error));
    }
  });
  client.on('guildBanRemove', async (member) => {
    const logSettings = await Logging.findOne({ guildId: member.guild.id });
    const unbannedChannelId = logSettings?.UnBannedChannelLog;
    const unbannedEmbedColor = logSettings?.UnBannedEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledUnBanned = logSettings?.isCodeEnabledUnBanned || false;

    // Fetch audit logs with the correct type
    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 22 });
    const audit = auditLogs.entries.first();

    if (!audit) {
        console.error('Error fetching audit log for unban.');
        return;
    }
    const name = member.user
    const { executor } = audit;
    const unbannedChannel = member.guild.channels.cache.get(unbannedChannelId);

    // Check if isCodeEnabledUnbanned is true before sending the unban message
    if (unbannedChannel && isCodeEnabled && isCodeEnabledUnBanned) {
        // تكوين الرسالة Embed
        const unbanEmbedOptions = {
            color: parseInt(unbannedEmbedColor.slice(1), 16),
            title: `:unlock: Member Unban`,
            description: `${name} has been unbanned from the server.`,
            fields: [
                { name: 'Responsible Moderator', value: `${executor} (${executor.id})` },
            ],
            footer: {
                text: member.guild.name,
                iconURL: member.guild.iconURL(),
            },
            thumbnail: {
                url: member.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
        };

        // إرسال الرسالة إلى قناة السجل لرفع الحظر
        unbannedChannel.send({ embeds: [unbanEmbedOptions] })
            .then(() => console.log('Unban message sent successfully'))
            .catch(error => console.error('Error sending unban message:', error));
    }
});

client.on('channelCreate', async (channel) => {
    const logSettings = await Logging.findOne({ guildId: channel.guild.id });
    const channelCreatedLogId = logSettings?.ChannelCreatedChannelLog;
    const channelCreatedEmbedColor = logSettings?.ChannelCreatedEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledChannelCreated = logSettings?.isCodeEnabledChannelCreated || false;
    
    try {
        const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 28 });
        const audit = auditLogs.entries.first();

        if (!audit) {
            console.error('Error fetching audit log for channel creation.');
            return;
        }

        const name = channel;
        const { executor } = audit;
        const channelCreatedLog = channel.guild.channels.cache.get(channelCreatedLogId);

        // Check if isCodeEnabledChannelCreated is true before sending the log
        if (channelCreatedLog && isCodeEnabled && isCodeEnabledChannelCreated) {
            // تكوين الرسالة Embed
            const channelCreatedEmbedOptions = {
                color: parseInt(channelCreatedEmbedColor.slice(1), 16),
                title: `:scroll: Channel Created`,
                description: `A new channel has been created: **${name}**`,
                fields: [
                    { name: 'Responsible Moderator', value: `${executor}` },
                ],
                footer: {
                    text: channel.guild.name,
                    iconURL: channel.guild.iconURL(),
                },
                timestamp: new Date(),
            };

            // إرسال الرسالة إلى قناة السجل لإشعار إنشاء القناة
            channelCreatedLog.send({ embeds: [channelCreatedEmbedOptions] })
                .then(() => console.log('Channel creation log sent successfully'))
                .catch(error => console.error('Error sending channel creation log:', error));
        }
    } catch (error) {
        console.error('Error fetching audit log for channel creation:', error);
    }
});

client.on('channelDelete', async (channel) => {
    const logSettings = await Logging.findOne({ guildId: channel.guild.id });
    const channelDeletedLogId = logSettings?.ChannelDeletedChannelLog;
    const channelDeletedEmbedColor = logSettings?.ChannelDeletedEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledChannelDeleted = logSettings?.isCodeEnabledChannelDeleted || false;
    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: 12 });
    const audit = auditLogs.entries.first();

    if (!audit) {
        console.error('Error fetching audit log for channel deletion.');
        return;
    }
    
    const name = channel.name;
    const { executor } = audit;
    const channelDeletedLog = channel.guild.channels.cache.get(channelDeletedLogId);

    // Check if isCodeEnabledChannelDeleted is true before sending the log
    if (channelDeletedLog && isCodeEnabled && isCodeEnabledChannelDeleted) {
        // تكوين الرسالة Embed
        const channelDeletedEmbedOptions = {
            color: parseInt(channelDeletedEmbedColor.slice(1), 16),
            title: `:wastebasket: Channel Deleted`,
            description: `The channel **${name}** has been deleted.`,
            fields: [
                { name: 'Responsible Moderator', value: `${executor}` },
            ],
            footer: {
                text: channel.guild.name,
                iconURL: channel.guild.iconURL(),
            },
            timestamp: new Date(),
        };

        // إرسال الرسالة إلى قناة السجل لإشعار حذف القناة
        channelDeletedLog.send({ embeds: [channelDeletedEmbedOptions] })
            .then(() => console.log('Channel deletion log sent successfully'))
            .catch(error => console.error('Error sending channel deletion log:', error));
    }
});
client.on('channelUpdate', async (oldChannel, newChannel) => {
    const logSettings = await Logging.findOne({ guildId: newChannel.guild.id });
    const channelUpdatedLogId = logSettings?.ChannelUpdatedChannelLog;
    const channelUpdatedEmbedColor = logSettings?.ChannelUpdatedEmbedColor || '#00000';
    const isCodeEnabled = logSettings?.isCodeEnabled || false;
    const isCodeEnabledChannelUpdated = logSettings?.isCodeEnabledChannelUpdated || false;
    const auditLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: 11 });
    const audit = auditLogs.entries.first();

    if (!audit) {
        console.error('Error fetching audit log for channel update.');
        return;
    }
    
    const name = newChannel;
    const { executor } = audit;
    const channelUpdatedLog = newChannel.guild.channels.cache.get(channelUpdatedLogId);

    // Check if isCodeEnabledChannelUpdated is true before sending the log
    if (channelUpdatedLog && isCodeEnabled && isCodeEnabledChannelUpdated) {
        // تكوين الرسالة Embed
        const channelUpdatedEmbedOptions = {
            color: parseInt(channelUpdatedEmbedColor.slice(1), 16),
            title: `:gear: Channel Updated`,
            description: `The channel **${name}** has been updated.`,
            fields: [
                { name: 'Responsible Moderator', value: `${executor}` },
            ],
            footer: {
                text: newChannel.guild.name,
                iconURL: newChannel.guild.iconURL(),
            },
            timestamp: new Date(),
        };

        // إرسال الرسالة إلى قناة السجل لإشعار تحديث القناة
        channelUpdatedLog.send({ embeds: [channelUpdatedEmbedOptions] })
            .then(() => console.log('Channel update log sent successfully'))
            .catch(error => console.error('Error sending channel update log:', error));
    }
});

client.on('roleCreate', async (newRole) => {
    try {
        const logSettings = await Logging.findOne({ guildId: newRole.guild.id });
        const roleCreatedLogId = logSettings?.RoleCreatedChannelLog;
        const roleCreatedEmbedColor = logSettings?.RoleCreatedEmbedColor || '#00000';
        const isCodeEnabled = logSettings?.isCodeEnabled || false;
        const isCodeEnabledRoleCreated = logSettings?.isCodeEnabledRoleCreated || false;

        const roleCreatedLog = newRole.guild.channels.cache.get(roleCreatedLogId);

        // Check if isCodeEnabledRoleCreated is true before sending the log
        if (roleCreatedLog && isCodeEnabled && isCodeEnabledRoleCreated) {
            // Fetch audit logs to get the user who created the role
            const auditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: 30 }); // Role creation type

            const audit = auditLogs.entries.first();
            
            if (audit) {
                const { executor } = audit;

                const roleCreatedEmbedOptions = {
                    color: parseInt(roleCreatedEmbedColor.slice(1), 16),
                    title: `:shield: New Role Created`,
                    description: `A new role named **${newRole.name}** has been created by **${executor}**.`,
                    footer: {
                        text: newRole.guild.name,
                        iconURL: newRole.guild.iconURL(),
                    },
                    timestamp: new Date(),
                };

                // إرسال الرسالة إلى قناة السجل لإشعار إنشاء دور جديد
                roleCreatedLog.send({ embeds: [roleCreatedEmbedOptions] })
                    .then(() => console.log('Role creation log sent successfully'))
                    .catch(error => console.error('Error sending role creation log:', error));
            }
        }
    } catch (error) {
        console.error('Error in roleCreate event:', error);
    }
});

client.on('roleDelete', async (deletedRole) => {
    try {
        const logSettings = await Logging.findOne({ guildId: deletedRole.guild.id });
        const roleDeletedLogId = logSettings?.RoleDeletedChannelLog;
        const roleDeletedEmbedColor = logSettings?.RoleDeletedEmbedColor || '#00000';
        const isCodeEnabled = logSettings?.isCodeEnabled || false;
        const isCodeEnabledRoleDeleted = logSettings?.isCodeEnabledRoleDeleted || false;

        const roleDeletedLog = deletedRole.guild.channels.cache.get(roleDeletedLogId);

        // Check if isCodeEnabledRoleDeleted is true before sending the log
        if (roleDeletedLog && isCodeEnabled && isCodeEnabledRoleDeleted) {
            // Fetch audit logs to get the user who deleted the role
            const auditLogs = await deletedRole.guild.fetchAuditLogs({ limit: 1, type: 32 }); // Role deletion type

            const audit = auditLogs.entries.first();
            
            if (audit) {
                const { executor } = audit;

                const roleDeletedEmbedOptions = {
                    color: parseInt(roleDeletedEmbedColor.slice(1), 16),
                    title: `:shield: Role Deleted`,
                    description: `The role **${deletedRole.name}** has been deleted by **${executor}**.`,
                    footer: {
                        text: deletedRole.guild.name,
                        iconURL: deletedRole.guild.iconURL(),
                    },
                    timestamp: new Date(),
                };

                // إرسال الرسالة إلى قناة السجل لإشعار حذف دور
                roleDeletedLog.send({ embeds: [roleDeletedEmbedOptions] })
                    .then(() => console.log('Role deletion log sent successfully'))
                    .catch(error => console.error('Error sending role deletion log:', error));
            }
        }
    } catch (error) {
        console.error('Error in roleDelete event:', error);
    }
});
client.on('roleUpdate', async (oldRole, newRole) => {
    try {
        const logSettings = await Logging.findOne({ guildId: newRole.guild.id });
        const roleUpdatedLogId = logSettings?.RoleUpdatedChannelLog;
        const roleUpdatedEmbedColor = logSettings?.RoleUpdatedEmbedColor || '#00000';
        const isCodeEnabled = logSettings?.isCodeEnabled || false;
        const isCodeEnabledRoleUpdated = logSettings?.isCodeEnabledRoleUpdated || false;

        const roleUpdatedLog = newRole.guild.channels.cache.get(roleUpdatedLogId);

        // Check if isCodeEnabledRoleUpdated is true before sending the log
        if (roleUpdatedLog && isCodeEnabled && isCodeEnabledRoleUpdated) {
            const changes = [];

            // Check for changes in permissions
            if (oldRole.permissions !== newRole.permissions) {
                changes.push(`**Permissions**: ${oldRole.permissions.bitfield.toString(2)} -> ${newRole.permissions.bitfield.toString(2)}`);
            }

            // Check for changes in name
            if (oldRole.name !== newRole.name) {
                changes.push(`**Name**: ${oldRole.name} -> ${newRole.name}`);
            }

            // Check for changes in color
            if (oldRole.color !== newRole.color) {
                changes.push(`**Color**: ${oldRole.color} -> ${newRole.color}`);
            }

            const auditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: 30 }); // Role update type
            const audit = auditLogs.entries.first();

            if (audit && audit.executor) {
                const { executor } = audit;

                const roleUpdatedEmbedOptions = {
                    color: parseInt(roleUpdatedEmbedColor.slice(1), 16),
                    title: `:hammer: Role Updated`,
                    description: `The role **${newRole.name}** has been updated by **${executor}**.`,
                    fields: [
                        {
                            name: 'Changes',
                            value: changes.join('\n'),
                        },
                    ],
                    footer: {
                        text: newRole.guild.name,
                        iconURL: newRole.guild.iconURL(),
                    },
                    timestamp: new Date(),
                };

                // Send the log message to the specified channel
                roleUpdatedLog.send({ embeds: [roleUpdatedEmbedOptions] })
                    .then(() => console.log('Role update log sent successfully'))
                    .catch(error => console.error('Error sending role update log:', error));
            }
        }
    } catch (error) {
        console.error('Error in roleUpdate event:', error);
    }
});



client.on('messageDelete', async (message) => {
    try {
        const logSettings = await Logging.findOne({ guildId: message.guild.id });

        if (logSettings && logSettings.isCodeEnabledMessageDeleted && logSettings.MessageDeletedChannelLog && logSettings.MessageDeletedEmbedColor) {
            const channel = client.channels.cache.get(logSettings.MessageDeletedChannelLog);
            if (channel) {
                const embed = new discord.MessageEmbed()
                    .setTitle(':wastebasket: Message Deleted')
                    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Deleted message in ${message.channel}: ${message.content}`)
                    .setTimestamp()
                    .setColor(logSettings.MessageDeletedEmbedColor);

                channel.send({ embeds: [embed] }).catch((error) => {
                    console.error('Error sending message delete log:', error);
                });
            } else {
                console.error('Channel not found:', logSettings.MessageDeletedChannelLog);
            }
        } else {
            console.error('Invalid log settings:', logSettings);
        }
    } catch (error) {
        console.error('Error in messageDelete event:', error);
    }
});

  
const protectionModel = require('./Database/models/protection');

client.on('messageCreate', async (message) => {
    try {
        const serverSettings = await protectionModel.findOne({ guildId: message.guild.id });

        if (serverSettings && serverSettings.isLinkProtectionEnabled && serverSettings.isCodeEnabled) {
            if (containsLink(message.content)) {
                if (serverSettings.allowedLinkChannelId && message.channel.id === serverSettings.allowedLinkChannelId) {
                } else {
                    await message.delete();
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
});

function containsLink(content) {
    return /https?:\/\/\S+/i.test(content);
}


client.on('guildMemberAdd', async (member) => {
    try {
        const serverSettings = await ProtectionModel.findOne({ guildId: member.guild.id });

        if (serverSettings && serverSettings.isAntiBotEnabled && serverSettings.isCodeEnabled && member.user.bot) {
            // التحقق من البوتات
            if (!isAllowedBot(member.user.id, serverSettings.allowedBotIds)) {
                await member.kick(); 
            }
        }
    } catch (error) {
        console.error(error);
    }
});

function isAllowedBot(botId, allowedBotIds) {
    return allowedBotIds.includes(botId);
}


const { XPModel } = require('./Database/Level/Level');

// عداد الرسائل
let messageCounter = 0;

client.on('messageCreate', async (message) => {
    const user = message.author;

    // التحقق مما إذا كان المرسل ليس بوت
    if (user.bot) {
        return;
    }

    // زيادة عداد الرسائل
    messageCounter++;

    if (messageCounter === 20) {
        // إذا وصل عداد الرسائل إلى 20، قم بإعادة تعيينه وحساب الخبرة
        messageCounter = 0;

        let xpData = await XPModel.findOneAndUpdate(
            { userId: user.id },
            { $inc: { xp: Math.ceil(Math.random() * (5 * 10)) } },
            { upsert: true, new: true }
        );

        const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));
        const level = calculateUserXp(xpData.xp);
        const newLevel = calculateUserXp(xpData.xp + xpData.xp);

        if (newLevel > level) {
            message.channel.send(`@${user.username}, **GG Your Level Up To ${newLevel} **`);
        }

        xpData.xp += xpData.xp; // تعديل هنا
        await xpData.save();
    }
});


client.login(token);


//Dashboard
const server = require('./server');

//Eroros
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});