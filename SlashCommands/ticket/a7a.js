const { SlashCommandBuilder } = require('discord.js');
const Cat = require('../../Database/tickets/ticket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a random cat image or specify a category')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Specify a category')
        ),

    async execute(interaction, client) {
        const selectedCategory = interaction.options.getString('category');

        if (!selectedCategory) {
            // إذا لم يتم تحديد فئة، قم بالبحث عن القنوات الصوتية والكتيجوريز
            const categories = [];
            const channels = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE');

            channels.forEach(channel => {
                const category = channel.parent;
                if (category && !categories.includes(category.name)) {
                    categories.push(category.name);
                }
            });

            // إرسال قائمة الكتيجوريز
            await interaction.reply(`Available categories: ${categories.join(', ')}`);
        } else {
            // إذا تم تحديد فئة، قم بحفظها في قاعدة البيانات
            await Cat.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { category: selectedCategory },
                { upsert: true }
            );
            await interaction.reply(`Category "${selectedCategory}" selected for user ${interaction.user.tag}`);
        }
    },
};
