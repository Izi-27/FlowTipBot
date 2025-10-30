const { SlashCommandBuilder } = require('discord.js');
const flowService = require('../services/flowService');
const dbService = require('../services/dbService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tip')
    .setDescription('Tip FLOW tokens to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to tip')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount of FLOW to tip')
        .setRequired(true)
        .setMinValue(0.01)),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const tipper = interaction.user;
      const recipient = interaction.options.getUser('user');
      const amount = interaction.options.getNumber('amount');

      // Validation
      if (recipient.bot) {
        return await interaction.editReply('❌ You cannot tip bots!');
      }

      if (recipient.id === tipper.id) {
        return await interaction.editReply('❌ You cannot tip yourself!');
      }

      // Check if users are registered
      const tipperData = await dbService.getUser(tipper.id);
      const recipientData = await dbService.getUser(recipient.id);

      if (!tipperData || !tipperData.flowAddress) {
        return await interaction.editReply(
          '❌ You need to register first! Use `/register <your_flow_address>`'
        );
      }

      if (!recipientData || !recipientData.flowAddress) {
        return await interaction.editReply(
          `❌ ${recipient.username} needs to register first!`
        );
      }

      // Check balance
      const balance = await flowService.getBalance(tipperData.flowAddress);
      if (balance < amount) {
        return await interaction.editReply(
          `❌ Insufficient balance! You have ${balance.toFixed(2)} FLOW`
        );
      }

      // Execute tip using Forte Actions
      const txId = await flowService.sendTip(
        tipperData.flowAddress,
        recipientData.flowAddress,
        amount
      );

      // Record in database
      await dbService.recordTip({
        from: tipper.id,
        to: recipient.id,
        amount,
        txId,
        timestamp: Date.now(),
        guildId: interaction.guildId
      });

      // Update leaderboard
      await dbService.updateLeaderboard(tipper.id, recipient.id, amount);

      // Success message
      await interaction.editReply({
        content: `✅ **Tip Sent!**\n\n` +
          `💰 ${tipper.username} tipped ${recipient.username} **${amount} FLOW**\n\n` +
          `🔗 Transaction: [View on Flowscan](https://testnet.flowscan.io/transaction/${txId})\n` +
          `⚡ Powered by Forte Actions`,
        allowedMentions: { users: [recipient.id] }
      });

      // Notify recipient
      try {
        await recipient.send(
          `🎁 You received a tip of **${amount} FLOW** from ${tipper.username}!\n` +
          `Transaction: https://testnet.flowscan.io/transaction/${txId}`
        );
      } catch (err) {
        console.log('Could not DM recipient:', err.message);
      }

    } catch (error) {
      console.error('Tip command error:', error);
      await interaction.editReply(
        '❌ Failed to process tip. Please try again later.'
      );
    }
  },
};
