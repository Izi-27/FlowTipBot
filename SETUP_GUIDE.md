# FlowTipBot Setup Guide

Complete guide to get your bot running for Forte Hacks submission!

## 🎯 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js v18+ installed
- [ ] Discord account
- [ ] Flow wallet with testnet FLOW
- [ ] OpenAI API key
- [ ] Firebase project (free tier is fine)
- [ ] Git installed

## 📋 Step-by-Step Setup

### 1. Discord Bot Setup (10 minutes)

1. **Create Discord Application**
   - Go to https://discord.com/developers/applications
   - Click "New Application"
   - Name it "FlowTipBot"
   - Click "Create"

2. **Create Bot User**
   - Go to "Bot" tab
   - Click "Add Bot"
   - Enable these Privileged Gateway Intents:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Click "Reset Token" and copy it (save for .env file)

3. **Get Client ID**
   - Go to "OAuth2" → "General"
   - Copy "Client ID" (save for .env file)

4. **Invite Bot to Server**
   - Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: `Send Messages`, `Read Messages`, `Use Slash Commands`
   - Copy generated URL and open in browser
   - Select your test server and authorize

### 2. Flow Wallet Setup (5 minutes)

1. **Get Flow Testnet Wallet**
   - Go to https://flow.com/wallet or use Flow CLI
   - Create new wallet or use existing
   - Copy your address (starts with 0x)

2. **Get Testnet FLOW**
   - Go to https://testnet-faucet.onflow.org/
   - Enter your address
   - Request testnet FLOW tokens
   - Wait for confirmation

3. **Export Private Key**
   - If using Flow Wallet: Settings → Export Private Key
   - If using Flow CLI: Check your flow.json
   - Save securely (needed for .env file)

### 3. OpenAI API Setup (5 minutes)

1. **Get API Key**
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Click "Create new secret key"
   - Copy key (save for .env file)

2. **Add Credits** (if needed)
   - Go to Billing
   - Add $5-10 for testing (should be plenty)

### 4. Firebase Setup (10 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "flowtipbot"
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Firestore**
   - In Firebase console, go to "Firestore Database"
   - Click "Create database"
   - Start in "test mode"
   - Choose location closest to you
   - Click "Enable"

3. **Get Service Account**
   - Go to Project Settings (gear icon)
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Download JSON file
   - Open it and copy these values for .env:
     - `project_id`
     - `private_key`
     - `client_email`

### 5. Install Project (5 minutes)

```bash
# Navigate to project directory
cd FlowTipBot

# Install dependencies
npm install

# Install additional required packages
npm install sha3
```

### 6. Configure Environment (5 minutes)

1. **Create .env file**
```bash
cp .env.example .env
```

2. **Edit .env file** with your credentials:

```env
# Discord Configuration
DISCORD_BOT_TOKEN=your_bot_token_from_step_1
DISCORD_CLIENT_ID=your_client_id_from_step_1

# Flow Blockchain Configuration
FLOW_NETWORK=testnet
FLOW_ACCOUNT_ADDRESS=your_flow_address_from_step_2
FLOW_PRIVATE_KEY=your_private_key_from_step_2

# OpenAI Configuration
OPENAI_API_KEY=your_openai_key_from_step_3

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id_from_step_4
FIREBASE_PRIVATE_KEY="your_private_key_from_step_4"
FIREBASE_CLIENT_EMAIL=your_client_email_from_step_4

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important**: For FIREBASE_PRIVATE_KEY, keep the quotes and include the full key with `\n` characters.

### 7. Deploy Discord Commands (2 minutes)

```bash
node src/deploy-commands.js
```

You should see:
```
✅ Loaded command: tip
✅ Loaded command: register
✅ Loaded command: balance
...
✅ Successfully reloaded 6 application (/) commands.
```

### 8. Start the Bot (1 minute)

```bash
npm start
```

You should see:
```
✅ Loaded command: tip
✅ Loaded command: register
...
✅ Bot login successful
🤖 FlowTipBot is online!
📊 Logged in as FlowTipBot#1234
```

## ✅ Testing Your Bot

### Test 1: Registration
In your Discord server:
```
/register 0xYOUR_FLOW_ADDRESS
```

Expected response:
```
✅ Registration Successful!
👤 Discord: YourUsername
💎 Flow Address: 0x...
💰 Balance: X.XX FLOW
```

### Test 2: Balance Check
```
/balance
```

Expected response:
```
💰 Your Balance
👤 User: YourUsername
💎 Address: 0x...
💵 Balance: X.XX FLOW
```

### Test 3: Tipping
```
/tip @friend 1
```

Expected response:
```
✅ Tip Sent!
💰 You tipped @friend 1 FLOW
🔗 Transaction: [View on Flowscan]
```

### Test 4: AI Scoring
Just send a helpful message in the channel. The bot will automatically score it!

## 🐛 Troubleshooting

### Bot doesn't respond to commands
- Check bot is online (green dot in Discord)
- Verify bot has proper permissions
- Make sure commands were deployed (`node src/deploy-commands.js`)
- Check console for errors

### "Could not verify address" error
- Make sure address exists on Flow testnet
- Verify you have testnet FLOW in wallet
- Check FLOW_ACCOUNT_ADDRESS in .env is correct

### Firebase errors
- Verify FIREBASE_PRIVATE_KEY has quotes and \n characters
- Check Firebase project has Firestore enabled
- Verify service account JSON is correct

### OpenAI errors
- Check API key is valid
- Verify you have credits in OpenAI account
- Make sure OPENAI_API_KEY in .env is correct

### Transaction fails
- Ensure Flow wallet has enough FLOW
- Check FLOW_PRIVATE_KEY is correct
- Verify network is set to "testnet"

## 📊 Next Steps

Once your bot is running:

1. **Test all features**
   - Register multiple test accounts
   - Send tips between accounts
   - Check leaderboards
   - Test AI scoring

2. **Create demo content**
   - Record video of bot in action
   - Take screenshots for README
   - Prepare social media posts

3. **Deploy to production** (optional)
   - Use a hosting service (Heroku, Railway, etc.)
   - Set environment variables
   - Keep bot running 24/7

## 🎬 For Forte Hacks Submission

### Required for submission:
- [ ] Bot running and tested
- [ ] Video demo recorded (3-5 minutes)
- [ ] README updated with your info
- [ ] GitHub repo is public
- [ ] Screenshots added
- [ ] Social media post created

### Video demo should show:
1. Bot registration
2. Sending tips
3. AI scoring in action
4. Leaderboard
5. Code walkthrough (show Forte Actions integration)

## 🚀 Quick Deploy Commands

```bash
# Full setup from scratch
npm install
cp .env.example .env
# Edit .env with your credentials
node src/deploy-commands.js
npm start

# Restart bot
npm start

# Deploy commands after changes
node src/deploy-commands.js
```

## 📞 Need Help?

- Check console logs for errors
- Review .env file for typos
- Verify all API keys are valid
- Test each service independently
- Ask in Flow Discord: https://link.flow.com/ForteDiscord

---

**You're ready to build! Good luck with Forte Hacks! 🚀**
