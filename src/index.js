require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Commands collection
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Loaded command: ${command.data.name}`);
    }
  }
}

// Bot ready event
client.once('ready', () => {
  console.log('🤖 FlowTipBot is online!');
  console.log(`📊 Logged in as ${client.user.tag}`);
  console.log(`🌐 Connected to ${client.guilds.cache.size} servers`);
  console.log(`👥 Serving ${client.users.cache.size} users`);
  
  // Set bot status
  client.user.setActivity('Tips on Flow | /help', { type: 'WATCHING' });
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error executing ${interaction.commandName}:`, error);
    
    const errorMessage = {
      content: '❌ There was an error executing this command!',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Handle message events for AI scoring
client.on('messageCreate', async message => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Import AI service
  const aiService = require('./services/aiService');
  
  // Score message quality (async, don't block)
  aiService.scoreMessage(message).catch(err => {
    console.error('AI scoring error:', err);
  });
});

// Error handling
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => console.log('✅ Bot login successful'))
  .catch(err => {
    console.error('❌ Failed to login:', err);
    process.exit(1);
  });

module.exports = client;
