const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands and how to use the bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#00EF8B')
      .setTitle('🤖 FlowTipBot Help')
      .setDescription('AI-powered tipping bot for Flow blockchain')
      .addFields(
        {
          name: '🎯 Getting Started',
          value: '1. Register your Flow wallet: `/register <address>`\n' +
                 '2. Make sure you have FLOW tokens in your wallet\n' +
                 '3. Start tipping: `/tip @user <amount>`'
        },
        {
          name: '💰 Tipping Commands',
          value: '`/tip @user <amount>` - Send FLOW to another user\n' +
                 '`/balance` - Check your FLOW balance\n' +
                 '`/history [limit]` - View your tipping history'
        },
        {
          name: '📊 Leaderboards',
          value: '`/leaderboard [type]` - View top tippers and recipients\n' +
                 'Types: `tippers`, `recipients`, `active`'
        },
        {
          name: '⚙️ Account Management',
          value: '`/register <address>` - Link your Flow wallet\n' +
                 '`/withdraw <amount> <address>` - Withdraw to external wallet'
        },
        {
          name: '🤖 AI Features',
          value: '`/ai-score <message_id>` - Get AI quality score for a message\n' +
                 'The bot automatically scores messages and rewards quality content!'
        },
        {
          name: '🔗 Useful Links',
          value: '[Get Flow Wallet](https://flow.com/wallet) • ' +
                 '[Testnet Faucet](https://testnet-faucet.onflow.org/) • ' +
                 '[GitHub](https://github.com/YourUsername/FlowTipBot)'
        }
      )
      .setFooter({ text: 'Built with Forte Actions • Forte Hacks 2025' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
