const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbService = require('../services/dbService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View your tipping history')
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of recent tips to show (default: 10)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(50)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.user.id;
      const limit = interaction.options.getInteger('limit') || 10;

      const history = await dbService.getTipHistory(userId, limit);

      if (!history || history.length === 0) {
        return await interaction.editReply('📜 No tipping history yet!');
      }

      const embed = new EmbedBuilder()
        .setColor('#00EF8B')
        .setTitle(`📜 Tipping History - ${interaction.user.username}`)
        .setDescription(`Showing last ${history.length} transactions`)
        .setTimestamp()
        .setFooter({ text: 'Powered by Flow & Forte Actions' });

      let historyText = '';
      for (const tip of history) {
        const date = new Date(tip.timestamp).toLocaleDateString();
        const type = tip.from === userId ? '📤 Sent' : '📥 Received';
        const otherUserId = tip.from === userId ? tip.to : tip.from;
        
        let otherUser;
        try {
          otherUser = await interaction.client.users.fetch(otherUserId);
        } catch {
          otherUser = { username: 'Unknown User' };
        }

        historyText += `${type} **${tip.amount} FLOW** ${tip.from === userId ? 'to' : 'from'} ${otherUser.username}\n`;
        historyText += `└ ${date} • [Tx](https://testnet.flowscan.io/transaction/${tip.txId})\n\n`;
      }

      embed.addFields({ name: 'Recent Transactions', value: historyText });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('History command error:', error);
      await interaction.editReply(
        '❌ Failed to fetch history. Please try again later.'
      );
    }
  },
};
