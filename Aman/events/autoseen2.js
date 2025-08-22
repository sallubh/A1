module.exports.config = {
  name: "autoseen2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aman",
  description: "Test autoseen",
  commandCategory: "no prefix",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = function ({ api, event }) {
  console.log("🔥 AUTOSEEN: Event received!");
  console.log("Event type:", event.type);
  console.log("From:", event.senderID);
  console.log("Bot ID:", api.getCurrentUserID());
  
  // Check if it's a message from someone else
  if (event.type === "message" && event.senderID !== api.getCurrentUserID()) {
    console.log("✅ Valid message, trying to mark as read...");
    
    api.markAsRead(event.threadID, function(err) {
      if (err) {
        console.log("❌ Error:", err);
      } else {
        console.log("✅ Marked as read successfully!");
      }
    });
  }
};

module.exports.run = function() {
  return "AutoSeen is active";
};
