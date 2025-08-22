const axios = require("axios");

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aman",
  description: "Automatically marks all messages as seen",
  commandCategory: "no prefix",
  usages: "automatic",
  cooldowns: 0
};

// Simple rate limiting - only allow one markAsReadAll every 5 seconds
let lastMarkTime = 0;

module.exports.handleEvent = async function ({ api, event }) {
  const { senderID } = event;

  // Don't mark own messages as seen
  if (senderID == api.getCurrentUserID()) return;

  // Rate limiting - only mark every 5 seconds
  const now = Date.now();
  if (now - lastMarkTime < 5000) return; // 5 second gap
  
  lastMarkTime = now;

  // Automatically mark all messages as seen (same as your original)
  try {
    await api.markAsReadAll();
  } catch (error) {
    console.error("AutoSeen error:", error.message);
  }
};

module.exports.run = async function () {
  return;
};
