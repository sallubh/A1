const axios = require("axios");

module.exports.config = {
  name: "autoseen",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aman",
  description: "Automatically marks messages as seen",
  commandCategory: "no prefix",
  usages: "automatic",
  cooldowns: 0
};

// Simple rate limiting
let lastSeenTime = 0;

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, type } = event;

  // Only process actual messages, not system events
  if (type !== "message") return;
  
  // Don't mark own messages as seen
  if (senderID == api.getCurrentUserID()) return;

  // Rate limit: only mark every 3 seconds to prevent spam
  const now = Date.now();
  if (now - lastSeenTime < 3000) return;
  
  lastSeenTime = now;

  // Try to mark the specific thread first, then fallback to markAsReadAll
  try {
    await api.markAsRead(threadID);
  } catch (error) {
    // If individual thread marking fails, try markAsReadAll with delay
    try {
      setTimeout(async () => {
        try {
          await api.markAsReadAll();
        } catch (e) {
          // Silent fail to prevent console spam
        }
      }, 1000);
    } catch (e) {
      // Silent fail
    }
  }
};

module.exports.run = async function () {
  return;
};
