//========= JoinNoti.js (Clean Version) =========//
const axios = require("axios");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.3",
  credits: "Aman Khan",
  description: "Welcome new members with custom lines + owner info + media attachment",
};

module.exports.run = () => {};

// Handle join events
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, logMessageData, logMessageType } = event;

  // ✅ Agar BOT khud group me add ho
  if (logMessageType === "log:subscribe" && logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    return api.sendMessage(
      `🤖 Hello doston, mai ${global.config.BOTNAME || "BOT"} group me aa gaya hu!`,
      threadID
    );
  }

  // ✅ Normal User Add Hua
  if (logMessageType === "log:subscribe") {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const { threadName, participantIDs } = threadInfo;

      let mentions = [];
      let nameArray = [];
      let memLength = [];
      let i = 0;

      for (let p of logMessageData.addedParticipants) {
        nameArray.push(p.fullName);
        mentions.push({ tag: p.fullName, id: p.userFbId });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      // ✅ Yaha ap multiple random lines dal sakte ho
      const randomLines = [
        "⚡ Stay active and enjoy your time!",
        "🌹 Respect sabko, masti unlimited 😍",
        "🔥 Ab group aur bhi mast hone wala hai!"
      ];
      const randomLine = randomLines[Math.floor(Math.random() * randomLines.length)];

      // ✅ Yaha Owner Info apna dalna
      const ownerInfo = `
👑 My Owner: AK
📩 Contact: https://m.me/100088677459075
      `;

      // ✅ Yaha multiple Imgur/URL media links dal sakte ho
      const mediaLinks = [
        "https://i.imgur.com/yourImage1.jpg",
        "https://i.imgur.com/yourImage2.gif",
        "https://i.imgur.com/yourVideo.mp4"
      ];
      const mediaUrl = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];

      const msg = {
        body: `🌸 Welcome @${nameArray.join(", ")} 🌸\n\n` +
              `📌 Group: ${threadName}\n` +
              `👥 Member No: ${memLength.join(", ")}\n\n` +
              `${randomLine}\n\n` +
              `${ownerInfo}`,
        mentions,
        attachment: await global.utils.getStreamFromURL(mediaUrl)
      };

      return api.sendMessage(msg, threadID);

    } catch (e) {
      console.error("joinNoti error:", e);
    }
  }
};
