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

// Rate limiting to prevent API spam
let isProcessing = false;

module.exports.handleEvent = async function ({ api, event }) {
  const { senderID, threadID, type } = event;

  // Only process actual messages
  if (type !== "message") return;
  
  // Don't mark own messages as seen
  if (senderID == api.getCurrentUserID()) return;

  // Prevent multiple simultaneous calls
  if (isProcessing) return;
  
  isProcessing = true;

  try {
    // Mark only the current thread, not all threads
    await api.markAsRead(threadID);
  } catch (error) {
    // If single thread fails, try markAsReadAll but with delay
    setTimeout(async () => {
      try {
        await api.markAsReadAll();
      } catch (e) {
        // Silent fail to prevent console spam
      }
    }, 2000);
  }

  // Reset processing flag after 1 second
  setTimeout(() => {
    isProcessing = false;
  }, 1000);
};

module.exports.run = async function () {
  return;
};
