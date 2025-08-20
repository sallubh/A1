const axios = require("axios");

module.exports.config = {
  name: "sony",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aman",
  description: "Gemini chatbot with sony/bot trigger and reply context",
  commandCategory: "no prefix",
  usages: "no prefix",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID, messageReply } = event;

  if (!body || senderID == api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase();

  // Check if message contains trigger words OR is a reply to bot's message
  const hasTriggerWords = lowerBody.includes("sony") || lowerBody.includes("bot");
  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();

  if (hasTriggerWords || isReplyToBot) {
    try {
      // Reaction 🥰
      api.setMessageReaction("🥰", messageID, (err) => {}, true);

      // Sender name fetch
      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID]?.name || "User";

      let finalMessage = body;

      // If replying to bot's message, include context
      if (isReplyToBot && messageReply) {
        const repliedMessage = messageReply.body || "";
        // Format: "Previous message: [old message] | User's reply: [new message]"
        finalMessage = `Previous message: ${repliedMessage} | User's reply: ${body}`;
      }

      // API call with context
      const res = await axios.post("https://api-of55.onrender.com/gemini", {
        message: finalMessage
      });

      if (!res.data || !res.data.reply) {
        return api.sendMessage("⚠️ sony ne sahi reply nahi diya.", threadID, messageID);
      }

      // Final message format
      const finalMsg = `👤 ${userName}\n\n${res.data.reply}\n\n*★᭄𝐎𝐰𝐧𝐞𝐫 𝐀 𝐊 ⚔️⏤͟͟͞͞★*`;

      return api.sendMessage(finalMsg, threadID, messageID);
    } catch (error) {
      console.error("Gemini API error:", error.message);
      return api.sendMessage("⚠️ fir se try kro lgta hai koi problem ho gayi hai: " + error.message, threadID, messageID);
    }
  }
};

module.exports.run = async function () {
  return;
};
