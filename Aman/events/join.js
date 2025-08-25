module.exports.config = {
  name: "joinnoti",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aman Khan",
  description: "Send a custom join notification with random image & owner info",
  commandCategory: "group",
  usages: "",
  cooldowns: 5
};

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    if (event.logMessageType === "log:subscribe") {
      const threadID = event.threadID;

      // Added member info
      const addedUser = event.logMessageData.addedParticipants[0];
      const name = addedUser.fullName || "Naya Member";

      // Image links (aapke diye hue)
      const images = [
        "https://i.supaimg.com/90e27f8c-cae4-4fd4-96a8-a7ab0275dd70.jpg",
        "https://i.supaimg.com/e847f151-772a-499d-ac8c-ef26368c4fb9.jpg",
        "https://i.supaimg.com/02382816-6fc2-4c03-a73e-6606b05bdee3.jpg"
      ];

      // Random image choose
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      // Owner details (aap update kar lena)
      const ownerName = "AK";
      const ownerUID = "100088677459075";

      const msg = {
        body: `👋 Welcome ${name}!\n\n🎉 Group me swagat hai!\n\n👑 Owner: ${ownerName}\n🔗 FB: https://facebook.com/${ownerUID}`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      };

      return api.sendMessage(msg, threadID);
    }
  } catch (err) {
    console.error("JoinNoti error:", err);
  }
};
