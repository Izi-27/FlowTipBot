# 🚀 Quick Start - Get Running in 15 Minutes!

**For Forte Hacks - Deadline Tomorrow!**

This is the fastest path to get FlowTipBot running. Detailed guide in `SETUP_GUIDE.md`.

---

## ⚡ Super Fast Setup

### 1. Get Your API Keys (10 min)

#### Discord Bot (3 min)
1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name it "FlowTipBot"
3. Go to "Bot" → "Add Bot"
4. Enable "Message Content Intent" and "Server Members Intent"
5. Copy bot token ✅
6. Go to "OAuth2" → Copy Client ID ✅

#### Flow Wallet (2 min)
1. Use existing Flow wallet or create at https://flow.com/wallet
2. Copy your address (0x...) ✅
3. Copy private key ✅
4. Get testnet FLOW: https://testnet-faucet.onflow.org/

#### OpenAI (2 min)
1. Go to https://platform.openai.com/api-keys
2. Create new key ✅
3. Add $5 credits if needed

#### Firebase (3 min)
1. Go to https://console.firebase.google.com/
2. Create project "flowtipbot"
3. Enable Firestore (test mode)
4. Project Settings → Service Accounts → Generate key
5. Copy project_id, private_key, client_email ✅

### 2. Install & Configure (3 min)

```bash
# Navigate to project
cd FlowTipBot

# Install
npm install
npm install sha3

# Create .env
cp .env.example .env
```

**Edit .env** with your keys:
```env
DISCORD_BOT_TOKEN=your_token
DISCORD_CLIENT_ID=your_id
FLOW_ACCOUNT_ADDRESS=0xyour_address
FLOW_PRIVATE_KEY=your_key
OPENAI_API_KEY=your_key
FIREBASE_PROJECT_ID=your_id
FIREBASE_PRIVATE_KEY="your_key_with_\n"
FIREBASE_CLIENT_EMAIL=your_email
```

### 3. Deploy & Run (2 min)

```bash
# Deploy Discord commands
node src/deploy-commands.js

# Start bot
npm start
```

You should see:
```
🤖 FlowTipBot is online!
```

### 4. Test (2 min)

In Discord:
```
/register 0xYOUR_FLOW_ADDRESS
/balance
/tip @friend 1
```

---

## ✅ You're Done!

Bot is running! Now:

1. **Test all features** (15 min)
2. **Record video demo** (30 min)
3. **Push to GitHub** (10 min)
4. **Submit to HackQuest** (10 min)

**Total time to submission: ~90 minutes!**

---

## 🎬 Quick Video Demo

Record 3-5 minute video showing:
1. Bot commands working
2. AI scoring a message
3. Leaderboard
4. Quick code walkthrough
5. Mention Forte Actions

Upload to YouTube, add link to README, submit!

---

## 📝 Quick Submission

1. Create GitHub repo
2. Push all code
3. Go to HackQuest
4. Fill form with:
   - GitHub link
   - Video link
   - Select tracks: Killer App, Vibe Coded, Forte Features
5. Submit!

---

## 🆘 Quick Troubleshooting

**Bot won't start?**
```bash
node --version  # Must be 18+
npm install
```

**Commands don't work?**
```bash
node src/deploy-commands.js
# Wait 5 minutes
```

**Need help?**
- Check SETUP_GUIDE.md
- Check console errors
- Ask in Flow Discord

---

**You've got this! The code is done, just configure and submit! 🚀**
