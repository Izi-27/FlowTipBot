// Mock Database Service - Uses JSON file instead of Firebase
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    users: {},
    tips: [],
    scores: [],
    leaderboard: {}
  }, null, 2));
}

// Helper functions to read/write database
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
  constructor() {
    // No initialization needed for JSON file
  }

  // User Management
  async registerUser(userData) {
    const db = readDB();
    db.users[userData.discordId] = {
      ...userData,
      createdAt: Date.now(),
    };
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
    const tipRef = this.tips.doc();
    await tipRef.set({
      ...tipData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return tipData;
  }

  async getTipHistory(userId, limit = 10) {
    const sentSnapshot = await this.tips
      .where('from', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const receivedSnapshot = await this.tips
      .where('to', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const allTips = [
      ...sentSnapshot.docs.map(doc => doc.data()),
      ...receivedSnapshot.docs.map(doc => doc.data()),
    ];

    // Sort by timestamp and limit
    return allTips
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async getUserStats(userId) {
    const sentSnapshot = await this.tips.where('from', '==', userId).get();
    const receivedSnapshot = await this.tips.where('to', '==', userId).get();

    const totalSent = sentSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
    const totalReceived = receivedSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    return {
      tipsSent: sentSnapshot.size,
      tipsReceived: receivedSnapshot.size,
      totalSent,
      totalReceived,
    };
  }

  // Leaderboard Management
  async updateLeaderboard(tipperId, recipientId, amount) {
    const batch = db.batch();

    // Update tipper stats
    const tipperRef = this.leaderboard.doc(tipperId);
    batch.set(
      tipperRef,
      {
        userId: tipperId,
        totalSent: admin.firestore.FieldValue.increment(amount),
        tipsSentCount: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Update recipient stats
    const recipientRef = this.leaderboard.doc(recipientId);
    batch.set(
      recipientRef,
      {
        userId: recipientId,
        totalReceived: admin.firestore.FieldValue.increment(amount),
        tipsReceivedCount: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();
  }

  async getTopTippers(limit = 10) {
    const snapshot = await this.leaderboard
      .orderBy('totalSent', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      userId: doc.data().userId,
      totalSent: doc.data().totalSent || 0,
      count: doc.data().tipsSentCount || 0,
    }));
  }

  async getTopRecipients(limit = 10) {
    const snapshot = await this.leaderboard
      .orderBy('totalReceived', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      userId: doc.data().userId,
      totalReceived: doc.data().totalReceived || 0,
      count: doc.data().tipsReceivedCount || 0,
    }));
  }

  async getMostActive(limit = 10) {
    const snapshot = await this.leaderboard.get();
    
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        totalActivity: (data.tipsSentCount || 0) + (data.tipsReceivedCount || 0),
      };
    });

    return users
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, limit);
  }

  // Message Score Management
  async storeMessageScore(scoreData) {
    const scoreRef = this.scores.doc(scoreData.messageId);
    await scoreRef.set({
      ...scoreData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return scoreData;
  }

  async getMessageScore(messageId) {
    const doc = await this.scores.doc(messageId).get();
    return doc.exists ? doc.data() : null;
  }

  async getRecentScores(guildId, days = 7) {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const snapshot = await this.scores
      .where('guildId', '==', guildId)
      .where('timestamp', '>=', cutoffDate)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }
}

module.exports = new DatabaseService();
