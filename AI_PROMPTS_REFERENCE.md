# AI Prompts Reference

**Use these prompts with Cursor, ChatGPT, or any AI coding assistant to modify or extend FlowTipBot**

---

## 🔧 Common Modifications

### Add New Discord Command

**Prompt**:
```
Create a new Discord slash command for FlowTipBot that [describe what it does].
It should:
- Use Discord.js v14 SlashCommandBuilder
- Follow the same pattern as existing commands in src/commands/
- Include error handling
- Use the existing flowService, aiService, and dbService
- Return user-friendly messages
```

**Example**:
```
Create a new Discord slash command for FlowTipBot that allows users to withdraw FLOW to an external address.
It should validate the address, check balance, execute the transaction, and confirm to the user.
```

---

### Modify AI Scoring Logic

**Prompt**:
```
Modify the AI scoring in src/services/aiService.js to [describe change].
Keep the existing OpenAI integration but adjust [specific aspect].
```

**Example**:
```
Modify the AI scoring in src/services/aiService.js to also consider message length and emoji usage.
Add these as additional scoring factors in the categories object.
```

---

### Change Reward Amounts

**Prompt**:
```
In src/services/aiService.js, change the auto-reward system to:
- Minimum score: [number]
- Reward amount: [number] FLOW
- Add tiered rewards based on score ranges
```

---

### Add New Database Collection

**Prompt**:
```
Add a new Firestore collection to src/services/dbService.js for [purpose].
Include methods to:
- Create new documents
- Query documents
- Update documents
- Delete documents
Follow the existing pattern used for users, tips, and scores collections.
```

---

## 🎨 UI/UX Improvements

### Improve Discord Embeds

**Prompt**:
```
Enhance the Discord embed in [command file] to be more visually appealing.
Add:
- Better formatting
- More emojis
- Color coding based on [criteria]
- Thumbnail or image
- Footer with useful info
```

---

### Add Reaction Buttons

**Prompt**:
```
Add Discord button components to [command] that allow users to:
- [Action 1]
- [Action 2]
- [Action 3]
Handle button interactions and update the message accordingly.
```

---

## 🔐 Security Enhancements

### Add Rate Limiting

**Prompt**:
```
Add rate limiting to prevent spam in [command].
Limit users to [number] uses per [time period].
Store rate limit data in Firebase and show friendly error messages.
```

---

### Add Transaction Verification

**Prompt**:
```
Add additional transaction verification to src/services/flowService.js.
Before executing a tip:
- Verify sender has sufficient balance
- Check recipient address is valid
- Confirm transaction parameters
- Add retry logic for failed transactions
```

---

## 📊 Analytics & Features

### Add Statistics Dashboard

**Prompt**:
```
Create a new command /stats that shows:
- Total tips sent in server
- Total FLOW volume
- Most active users
- Average tip amount
- Tips per day chart (text-based)
Use data from dbService and format as a Discord embed.
```

---

### Add Scheduled Tips

**Prompt**:
```
Add functionality for scheduled/recurring tips.
Create:
- /schedule-tip command to set up recurring tips
- Background job to execute scheduled tips
- Database schema for scheduled tips
- /cancel-schedule command
```

---

## 🌐 Multi-Token Support

### Add USDC Support

**Prompt**:
```
Extend FlowTipBot to support fUSDC in addition to FLOW.
Modify:
- flowService.js to handle multiple token types
- Commands to accept token type parameter
- Database to track token types
- Balance checking for multiple tokens
```

---

## 🤖 AI Enhancements

### Improve Content Scoring

**Prompt**:
```
Enhance the AI content scoring in aiService.js to:
- Consider conversation context
- Analyze sentiment
- Detect spam/low-quality content
- Give bonus points for helpful code snippets
- Penalize toxic messages
Update the scoring prompt and add new categories.
```

---

### Add AI Tip Suggestions

**Prompt**:
```
Add a feature where users can ask the AI to suggest a tip amount.
Create /suggest-tip command that:
- Analyzes the referenced message
- Uses AI to determine fair tip amount
- Explains the reasoning
- Allows user to confirm or adjust
```

---

## 🐛 Debugging Prompts

### Fix Error

**Prompt**:
```
I'm getting this error in FlowTipBot:
[paste error message]

The error occurs when [describe what you were doing].
Please help me fix it by:
1. Explaining what's wrong
2. Providing the corrected code
3. Explaining how to prevent it in the future
```

---

### Optimize Performance

**Prompt**:
```
The [feature] in FlowTipBot is slow.
Analyze [file name] and suggest optimizations for:
- Database queries
- API calls
- Code efficiency
Provide specific code improvements.
```

---

## 📱 Platform Extensions

### Add Twitter Integration

**Prompt**:
```
Extend FlowTipBot to work on Twitter/X.
Create:
- Twitter bot using Twitter API v2
- Mention detection for tips (@tip @user amount)
- Tweet quality scoring
- Database integration for Twitter users
Follow the same architecture as Discord bot.
```

---

### Add Telegram Support

**Prompt**:
```
Create a Telegram version of FlowTipBot.
Use node-telegram-bot-api and implement:
- /tip command
- /register command
- /balance command
- Inline buttons for interactions
Reuse existing flowService, aiService, and dbService.
```

---

## 🎯 Testing Prompts

### Generate Test Cases

**Prompt**:
```
Create comprehensive test cases for [command/feature].
Include:
- Unit tests using Jest
- Edge cases
- Error scenarios
- Mock data
- Expected outputs
```

---

### Create Mock Data

**Prompt**:
```
Generate realistic mock data for testing FlowTipBot:
- 10 test users with Discord IDs and Flow addresses
- 50 tip transactions
- 30 AI message scores
- Leaderboard data
Format as JSON that can be imported into Firebase.
```

---

## 📚 Documentation Prompts

### Generate API Documentation

**Prompt**:
```
Create API documentation for [service/file].
Include:
- Function descriptions
- Parameters and types
- Return values
- Usage examples
- Error handling
Format as JSDoc comments.
```

---

### Create User Guide

**Prompt**:
```
Write a user guide for FlowTipBot explaining:
- How to get started
- All available commands
- Best practices
- FAQ
- Troubleshooting
Make it beginner-friendly with examples.
```

---

## 🚀 Deployment Prompts

### Deploy to Heroku

**Prompt**:
```
Provide step-by-step instructions to deploy FlowTipBot to Heroku.
Include:
- Procfile creation
- Environment variable setup
- Database configuration
- Deployment commands
- Monitoring setup
```

---

### Create Docker Container

**Prompt**:
```
Create a Dockerfile for FlowTipBot that:
- Uses Node.js 18
- Installs dependencies
- Sets up environment
- Runs the bot
Also create docker-compose.yml for local development.
```

---

## 💡 Pro Tips for Using AI

### 1. Be Specific
❌ "Make it better"
✅ "Add error handling for when the user's wallet has insufficient balance"

### 2. Provide Context
Include:
- What file you're modifying
- What the current behavior is
- What you want it to do
- Any constraints or requirements

### 3. Ask for Explanations
Add to your prompt:
"Explain what changes you made and why"

### 4. Request Multiple Options
"Provide 3 different approaches to solve this"

### 5. Iterate
Start simple, then refine:
1. "Create basic feature"
2. "Add error handling"
3. "Improve user experience"
4. "Optimize performance"

---

## 🎓 Learning Prompts

### Understand Existing Code

**Prompt**:
```
Explain how [file/function] works in FlowTipBot.
Break it down step-by-step and explain:
- What it does
- How it works
- Why it's structured this way
- What each part does
```

---

### Learn Flow Concepts

**Prompt**:
```
Explain [Flow concept] in the context of FlowTipBot.
How is it used in [specific file]?
Provide examples of how to use it for [use case].
```

---

## 🔄 Quick Fixes

### Update Dependencies

**Prompt**:
```
Update package.json dependencies for FlowTipBot to latest versions.
Check for:
- Security vulnerabilities
- Breaking changes
- Deprecated packages
Provide updated package.json and migration notes.
```

---

### Fix Linting Errors

**Prompt**:
```
Fix all linting errors in [file].
Follow JavaScript/Node.js best practices.
Maintain existing functionality.
```

---

## 📞 Getting Help

If AI doesn't understand:
1. Provide more context
2. Show the current code
3. Explain what you've tried
4. Describe the expected vs actual behavior

**Example**:
```
I'm trying to add [feature] to FlowTipBot.

Current code in [file]:
[paste code]

What I want:
[describe desired behavior]

What's happening:
[describe current behavior]

Error message (if any):
[paste error]

Please help me fix this.
```

---

**Remember**: AI is a tool to help you build faster. Always test the code it generates and understand what it does before using it in production!

🤖 Happy vibe coding! 🚀
