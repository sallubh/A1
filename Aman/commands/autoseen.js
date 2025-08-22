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
  // Don't process own messages
  if (event.senderID == api.getCurrentUserID()) return;
  
  // Only process message events
  if (event.type != "message") return;

  // Simple mark as read with error handling
  api.markAsRead(event.threadID, (err) => {
    if (err) {
      // If individual thread fails, don't do anything
      // This prevents the spam errors you were seeing
    }
  });
};

module.exports.run = async function ({ api, event }) {
  return;
};
