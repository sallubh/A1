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

module.exports.handleEvent = async function ({ api, event }) {
  const { senderID } = event;

  // Don't mark own messages as seen
  if (senderID == api.getCurrentUserID()) return;

  // Automatically mark all messages as seen
  try {
    await api.markAsReadAll();
  } catch (error) {
    console.error("AutoSeen error:", error.message);
  }
};

module.exports.run = async function () {
  return;
};
