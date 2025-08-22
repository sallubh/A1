const axios = require("axios");

module.exports.config = {
  name: "autoseen",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Aman",
  description: "Automatically marks messages as seen with rate limiting",
  commandCategory: "no prefix",
  usages: "automatic",
  cooldowns: 0
};

// Rate limiting variables
let lastMarkTime = 0;
let markQueue = new Set();
let isProcessing = false;

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID } = event;

  // Don't mark own messages as seen
  if (senderID == api.getCurrentUserID()) return;

  // Add to queue for processing
  markQueue.add(threadID);
  
  // Process queue with rate limiting
  processMarkQueue(api);
};

async function processMarkQueue(api) {
  // Prevent multiple simultaneous processing
  if (isProcessing) return;
  
  const now = Date.now();
  // Rate limit: only mark as read every 2 seconds
  if (now - lastMarkTime < 2000) {
    // Schedule for later if too frequent
    setTimeout(() => processMarkQueue(api), 2000);
    return;
  }

  if (markQueue.size === 0) return;

  isProcessing = true;
  lastMarkTime = now;

  try {
    // Get threads to mark (limit to 10 at a time to prevent overload)
    const threadsToMark = Array.from(markQueue).slice(0, 10);
    markQueue.clear();

    // Mark individual threads instead of all at once
    for (const threadID of threadsToMark) {
      try {
        await api.markAsRead(threadID);
        // Small delay between each mark to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`AutoSeen error for thread ${threadID}:`, error.message);
        // If error, try markAsReadAll as fallback (but with delay)
        if (threadsToMark.length === 1) {
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await api.markAsReadAll();
          } catch (fallbackError) {
            // Silently fail to avoid spam
          }
        }
      }
    }
  } catch (error) {
    console.log("AutoSeen batch error:", error.message);
  } finally {
    isProcessing = false;
    
    // If there are still items in queue, schedule next processing
    if (markQueue.size > 0) {
      setTimeout(() => processMarkQueue(api), 3000);
    }
  }
}

module.exports.run = async function () {
  return;
};
