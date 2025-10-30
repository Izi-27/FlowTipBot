const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbService = require('../services/dbService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View tipping leaderboards')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .setRequired(false)
        .addChoices(
          { name: 'Top Tippers', value: 'tippers' },
          { name: 'Top Recipients', value: 'recipients' },
          { name: 'Most Active', value: 'active' }
        )),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const type = interaction.options.getString('type') || 'tippers';
      let leaderboard;
      let title;
      let description;

      switch (type) {
        case 'tippers':
          leaderboard = await dbService.getTopTippers(10);
          title = '🏆 Top Tippers';
          description = 'Users who have sent the most FLOW';
          break;
        case 'recipients':
          leaderboard = await dbService.getTopRecipients(10);
          title = '💎 Top Recipients';
          description = 'Users who have received the most FLOW';
          break;
        case 'active':
          leaderboard = await dbService.getMostActive(10);
          title = '⚡ Most Active';
          description = 'Users with the most tipping activity';
          break;
      }

      if (!leaderboard || leaderboard.length === 0) {
        return await interaction.editReply('📊 No tipping data yet! Be the first to tip!');
      }

      // Create embed
      const embed = new EmbedBuilder()
        .setColor('#00EF8B')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: 'Powered by Flow & Forte Actions' });

      // Add leaderboard entries
      let leaderboardText = '';
      for (let i = 0; i < leaderboard.length; i++) {
        const entry = leaderboard[i];
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        
        let user;
        try {
          user = await interaction.client.users.fetch(entry.userId);
        } catch {
          user = { username: 'Unknown User' };
        }

        if (type === 'tippers') {
          leaderboardText += `${medal} **${user.username}** - ${entry.totalSent.toFixed(2)} FLOW (${entry.count} tips)\n`;
        } else if (type === 'recipients') {
          leaderboardText += `${medal} **${user.username}** - ${entry.totalReceived.toFixed(2)} FLOW (${entry.count} tips)\n`;
        } else {
          leaderboardText += `${medal} **${user.username}** - ${entry.totalActivity} total tips\n`;
        }
      }

      embed.addFields({ name: 'Rankings', value: leaderboardText });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Leaderboard command error:', error);
      await interaction.editReply(
        '❌ Failed to fetch leaderboard. Please try again later.'
      );
    }
  },
};
