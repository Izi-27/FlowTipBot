// Mock AI Service - No OpenAI API needed
const dbService = require('./dbService');
const flowService = require('./flowService');

class AIService {
  constructor() {
    this.minScoreForReward = 7.5; // Out of 10
    this.rewardAmount = 0.1; // FLOW tokens
  }

  // Score message quality using AI
  async scoreMessage(message) {
    try {
      // Skip if message is too short
      if (message.content.length < 20) {
        return null;
      }

      // Mock AI scoring algorithm
      const content = message.content.toLowerCase();
      const length = message.content.length;
      
      // Calculate score based on various factors
      let helpfulness = 5;
      let creativity = 5;
      let engagement = 5;
      
      // Length bonus (longer messages tend to be more detailed)
      if (length > 100) helpfulness += 2;
      if (length > 200) helpfulness += 1;
      
      // Helpful keywords
      const helpfulWords = ['help', 'thanks', 'tutorial', 'guide', 'explain', 'how to', 'solution'];
      helpfulWords.forEach(word => {
        if (content.includes(word)) helpfulness += 0.5;
      });
      
      // Creative indicators
      const creativeWords = ['idea', 'think', 'suggest', 'could', 'maybe', 'what if'];
      creativeWords.forEach(word => {
        if (content.includes(word)) creativity += 0.5;
      });
      
      // Engagement indicators (questions, emojis, mentions)
      if (content.includes('?')) engagement += 1;
      if (message.content.match(/[😀-🙏]/)) engagement += 1;
      if (message.mentions.users.size > 0) engagement += 1;
      
      // Cap scores at 10
      helpfulness = Math.min(10, helpfulness);
      creativity = Math.min(10, creativity);
      engagement = Math.min(10, engagement);
      
      const overallScore = (helpfulness + creativity + engagement) / 3;
      
      const scoreData = {
        score: parseFloat(overallScore.toFixed(1)),
        reasoning: `Message scored based on length (${length} chars), helpful content, and engagement factors`,
        categories: {
          helpfulness: parseFloat(helpfulness.toFixed(1)),
          creativity: parseFloat(creativity.toFixed(1)),
          engagement: parseFloat(engagement.toFixed(1))
        }
      };

      // Store score in database
      await dbService.storeMessageScore({
        messageId: message.id,
        userId: message.author.id,
        guildId: message.guild.id,
        score: scoreData.score,
        reasoning: scoreData.reasoning,
        categories: scoreData.categories,
        timestamp: Date.now(),
      });

      // Auto-reward high-quality content
      if (scoreData.score >= this.minScoreForReward) {
        await this.autoRewardMessage(message, scoreData);
      }

      return scoreData;
    } catch (error) {
      console.error('Error scoring message:', error);
      return null;
    }
  }

  // Automatically reward high-quality messages
  async autoRewardMessage(message, scoreData) {
    try {
      // Check if user is registered
      const userData = await dbService.getUser(message.author.id);
      if (!userData || !userData.flowAddress) {
        // Notify user they could have earned a reward
        await message.reply(
          `🤖 **AI Quality Score: ${scoreData.score}/10** ✨\n\n` +
          `Your message was rated as high quality! Register with \`/register\` to earn automatic FLOW rewards for great content!`
        );
        return;
      }

      // Send reward
      const txId = await flowService.sendTip(
        process.env.FLOW_ACCOUNT_ADDRESS,
        userData.flowAddress,
        this.rewardAmount
      );

      // Record reward
      await dbService.recordTip({
        from: 'AI_BOT',
        to: message.author.id,
        amount: this.rewardAmount,
        txId,
        timestamp: Date.now(),
        guildId: message.guild.id,
        isAIReward: true,
      });

      // Notify user
      await message.reply(
        `🤖 **AI Quality Reward!** ✨\n\n` +
        `Score: **${scoreData.score}/10**\n` +
        `Reward: **${this.rewardAmount} FLOW**\n` +
        `Reason: ${scoreData.reasoning}\n\n` +
        `[View Transaction](https://testnet.flowscan.io/transaction/${txId})`
      );

    } catch (error) {
      console.error('Error auto-rewarding message:', error);
    }
  }

  // Get AI suggestion for tip amount based on message
  async suggestTipAmount(message) {
    try {
      const length = message.content.length;
      let amount = 0.5; // Base amount
      
      // Adjust based on message length
      if (length > 100) amount += 0.5;
      if (length > 200) amount += 0.5;
      if (length > 500) amount += 1.0;
      
      // Check for helpful content
      const content = message.content.toLowerCase();
      if (content.includes('tutorial') || content.includes('guide')) amount += 1.0;
      if (content.includes('code') || content.includes('```')) amount += 0.5;
      
      // Cap at reasonable amount
      amount = Math.min(10, amount);
      
      return {
        amount: parseFloat(amount.toFixed(2)),
        reasoning: `Suggested based on message length and content quality`
      };
    } catch (error) {
      console.error('Error suggesting tip amount:', error);
      return { amount: 1.0, reasoning: 'Default suggestion' };
    }
  }

  // Analyze community engagement
  async analyzeEngagement(guildId, days = 7) {
    try {
      const scores = await dbService.getRecentScores(guildId, days);
      
      if (scores.length === 0) {
        return null;
      }

      const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
      const highQualityCount = scores.filter(s => s.score >= 7).length;
      const engagementRate = (highQualityCount / scores.length) * 100;

      return {
        averageScore: avgScore.toFixed(2),
        totalMessages: scores.length,
        highQualityMessages: highQualityCount,
        engagementRate: engagementRate.toFixed(1),
        period: `${days} days`,
      };
    } catch (error) {
      console.error('Error analyzing engagement:', error);
      return null;
    }
  }
}

module.exports = new AIService();
