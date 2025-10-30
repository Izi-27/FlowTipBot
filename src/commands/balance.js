const { SlashCommandBuilder } = require('discord.js');
const dbService = require('../services/dbService');
const flowService = require('../services/flowService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your FLOW balance'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.user.id;
      const userData = await dbService.getUser(userId);

      if (!userData || !userData.flowAddress) {
        return await interaction.editReply(
          '❌ You need to register first! Use `/register <your_flow_address>`'
        );
      }

      // Get balance from Flow blockchain
      const balance = await flowService.getBalance(userData.flowAddress);

      // Get tipping stats
      const stats = await dbService.getUserStats(userId);

      await interaction.editReply({
        content: `💰 **Your Balance**\n\n` +
          `👤 User: ${interaction.user.username}\n` +
          `💎 Address: \`${userData.flowAddress}\`\n` +
          `💵 Balance: **${balance.toFixed(2)} FLOW**\n\n` +
          `📊 **Tipping Stats**\n` +
          `📤 Tips Sent: ${stats.tipsSent} (${stats.totalSent.toFixed(2)} FLOW)\n` +
          `📥 Tips Received: ${stats.tipsReceived} (${stats.totalReceived.toFixed(2)} FLOW)\n` +
          `🏆 Net Tips: ${(stats.totalReceived - stats.totalSent).toFixed(2)} FLOW`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Balance command error:', error);
      await interaction.editReply(
        '❌ Failed to fetch balance. Please try again later.'
      );
    }
  },
};
