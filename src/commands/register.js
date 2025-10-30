const { SlashCommandBuilder } = require('discord.js');
const dbService = require('../services/dbService');
const flowService = require('../services/flowService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register your Flow wallet address')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('Your Flow wallet address (0x...)')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.user.id;
      const address = interaction.options.getString('address');

      // Validate Flow address format
      if (!address.startsWith('0x') || address.length !== 18) {
        return await interaction.editReply(
          '❌ Invalid Flow address format! Address should start with 0x and be 18 characters long.'
        );
      }

      // Check if address is already registered
      const existingUser = await dbService.getUserByAddress(address);
      if (existingUser && existingUser.discordId !== userId) {
        return await interaction.editReply(
          '❌ This Flow address is already registered to another user!'
        );
      }

      // Verify address exists on Flow blockchain
      const isValid = await flowService.verifyAddress(address);
      if (!isValid) {
        return await interaction.editReply(
          '❌ Could not verify this address on Flow testnet. Make sure it exists!'
        );
      }

      // Register user
      await dbService.registerUser({
        discordId: userId,
        username: interaction.user.username,
        flowAddress: address,
        registeredAt: Date.now()
      });

      // Get balance
      const balance = await flowService.getBalance(address);

      await interaction.editReply(
        `✅ **Registration Successful!**\n\n` +
        `👤 Discord: ${interaction.user.username}\n` +
        `💎 Flow Address: \`${address}\`\n` +
        `💰 Balance: **${balance.toFixed(2)} FLOW**\n\n` +
        `You can now send and receive tips! Try \`/tip @user <amount>\``
      );

    } catch (error) {
      console.error('Register command error:', error);
      await interaction.editReply(
        '❌ Failed to register. Please try again later.'
      );
    }
  },
};
