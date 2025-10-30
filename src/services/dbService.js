// Simple JSON File Database - No Firebase needed
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data.json');

// Initialize database file
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    users: {},
    tips: [],
    scores: [],
    leaderboard: {}
  }, null, 2));
}

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    return { users: {}, tips: [], scores: [], leaderboard: {} };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

class DatabaseService {
  // User Management
  async registerUser(userData) {
    const db = readDB();
    db.users[userData.discordId] = { ...userData, createdAt: Date.now() };
    writeDB(db);
    return userData;
  }

  async getUser(discordId) {
    const db = readDB();
    return db.users[discordId] || null;
  }

  async getUserByAddress(flowAddress) {
    const db = readDB();
    const users = Object.values(db.users);
    return users.find(u => u.flowAddress === flowAddress) || null;
  }

  // Tip Management
  async recordTip(tipData) {
    const db = readDB();
    db.tips.push({ ...tipData, id: Date.now().toString(), createdAt: Date.now() });
    writeDB(db);
    return tipData;
  }

  async getTipHistory(userId, limit = 10) {
    const db = readDB();
    const userTips = db.tips.filter(t => t.from === userId || t.to === userId);
    return userTips.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }

  async getUserStats(userId) {
    const db = readDB();
    const sent = db.tips.filter(t => t.from === userId);
    const received = db.tips.filter(t => t.to === userId);
    
    return {
      tipsSent: sent.length,
      tipsReceived: received.length,
      totalSent: sent.reduce((sum, t) => sum + t.amount, 0),
      totalReceived: received.reduce((sum, t) => sum + t.amount, 0),
    };
  }

  // Leaderboard Management
  async updateLeaderboard(tipperId, recipientId, amount) {
    const db = readDB();
    
    if (!db.leaderboard[tipperId]) {
      db.leaderboard[tipperId] = { userId: tipperId, totalSent: 0, totalReceived: 0, tipsSentCount: 0, tipsReceivedCount: 0 };
    }
    if (!db.leaderboard[recipientId]) {
      db.leaderboard[recipientId] = { userId: recipientId, totalSent: 0, totalReceived: 0, tipsSentCount: 0, tipsReceivedCount: 0 };
    }
    
    db.leaderboard[tipperId].totalSent += amount;
    db.leaderboard[tipperId].tipsSentCount += 1;
    db.leaderboard[recipientId].totalReceived += amount;
    db.leaderboard[recipientId].tipsReceivedCount += 1;
    
    writeDB(db);
  }

  async getTopTippers(limit = 10) {
    const db = readDB();
    const users = Object.values(db.leaderboard);
    return users
      .sort((a, b) => (b.totalSent || 0) - (a.totalSent || 0))
      .slice(0, limit)
      .map(u => ({ userId: u.userId, totalSent: u.totalSent || 0, count: u.tipsSentCount || 0 }));
  }

  async getTopRecipients(limit = 10) {
    const db = readDB();
    const users = Object.values(db.leaderboard);
    return users
      .sort((a, b) => (b.totalReceived || 0) - (a.totalReceived || 0))
      .slice(0, limit)
      .map(u => ({ userId: u.userId, totalReceived: u.totalReceived || 0, count: u.tipsReceivedCount || 0 }));
  }

  async getMostActive(limit = 10) {
    const db = readDB();
    const users = Object.values(db.leaderboard);
    return users
      .map(u => ({
        userId: u.userId,
        totalActivity: (u.tipsSentCount || 0) + (u.tipsReceivedCount || 0)
      }))
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, limit);
  }

  // Message Score Management
  async storeMessageScore(scoreData) {
    const db = readDB();
    db.scores.push({ ...scoreData, id: Date.now().toString(), createdAt: Date.now() });
    writeDB(db);
    return scoreData;
  }

  async getMessageScore(messageId) {
    const db = readDB();
    return db.scores.find(s => s.messageId === messageId) || null;
  }

  async getRecentScores(guildId, days = 7) {
    const db = readDB();
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return db.scores.filter(s => s.guildId === guildId && s.timestamp >= cutoffDate);
  }
}

module.exports = new DatabaseService();
