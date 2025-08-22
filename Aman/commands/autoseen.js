module.exports.config = {
  name: "autoseen",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Aman (Optimized by ChatGPT)",
  description: "Automatically marks messages as seen with load handling",
  commandCategory: "no prefix",
  usages: "automatic",
  cooldowns: 0
};

let seenQueue = [];
let isProcessing = false;

module.exports.handleEvent = async function ({ api, event }) {
  const { senderID, threadID } = event;

  // Don't mark own messages
  if (senderID == api.getCurrentUserID()) return;

  // Push threadID in queue
  if (!seenQueue.includes(threadID)) {
    seenQueue.push(threadID);
  }

  // Process queue
  if (!isProcessing) {
    processQueue(api);
  }
};

async function processQueue(api) {
  isProcessing = true;
  while (seenQueue.length > 0) {
    const threadID = seenQueue.shift();
    try {
      await api.markAsRead(threadID);
      console.log(`✅ Seen: ${threadID}`);
    } catch (error) {
      console.error("❌ AutoSeen error:", error.message);
    }
    // Small delay to avoid overload
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  isProcessing = false;
}

module.exports.run = async function () {
  return;
};
