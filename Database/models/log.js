const { Schema, model } = require('mongoose');

const loggingSchema = new Schema({
    guildId: String,
    isCodeEnabled: Boolean,
    isCodeEnabledwelcome: Boolean,
    welcomeChannelLog: String,
    welcomeEmbedColor: String,
    isCodeEnabledLeave: Boolean,
    LeaveChannelLog: String,
    LeaveEmbedColor: String,
    isCodeEnabledBanned: Boolean,
    BannedChannelLog: String,
    BannedEmbedColor: String,
    isCodeEnabledUnBanned: Boolean,
    UnBannedChannelLog: String,
    UnBannedEmbedColor: String,
    isCodeEnabledChannelCreated: Boolean,
    ChannelCreatedChannelLog: String,
    ChannelCreatedEmbedColor: String,
    isCodeEnabledChannelDeleted: Boolean,
    ChannelDeletedChannelLog: String,
    ChannelDeletedEmbedColor: String,
    isCodeEnabledChannelUpdated: Boolean,
    ChannelUpdatedChannelLog: String,
    ChannelUpdatedEmbedColor: String,
    isCodeEnabledRoleCreated: Boolean,
    RoleCreatedChannelLog: String,
    RoleCreatedEmbedColor: String,
    isCodeEnabledRoleDeleted: Boolean,
    RoleDeletedChannelLog: String,
    RoleDeletedEmbedColor: String,
    isCodeEnabledRoleUpdated: Boolean,
    RoleUpdatedChannelLog: String,
    RoleUpdatedEmbedColor: String,
    isCodeEnabledMessageDeleted: Boolean,
    MessageDeletedChannelLog: String,
    MessageDeletedEmbedColor: String,
});

const Logging = model('Logging', loggingSchema);

module.exports = Logging;
