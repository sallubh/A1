// joinNoti.js
module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.3",
  credits: "AMAN (for AK)",
  description: "Welcome message with owner info & random image",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "axios": ""
  }
};

module.exports.onLoad = () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const dir = path.join(__dirname, "cache", "joinNoti");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.run = async function({ api, event, Threads }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];

  const { threadID } = event;

  // If the bot itself was added — simple text, no attachment
  if (event.logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) {
    try {
      const prefix = global.config?.PREFIX || ".";
      const botName = global.config?.BOTNAME || "AK BOT";
      return api.sendMessage(
        `👋 ${botName} is now in this group!\nPrefix: ${prefix}\nOwner: Aman Khan\nFB: https://www.facebook.com/profile.php?id=100088677459075`,
        threadID
      );
    } catch (e) {
      return; // keep silent if anything odd happens here
    }
  }

  // New member(s) joined
  try {
    // Get current thread info
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const memberCountNow = Array.isArray(participantIDs) ? participantIDs.length : "";

    // Random welcome lines (edit/add as you like)
    const welcomeLines = [
      "Dosti hi zindagi ka asli khazana hai. ✨",
      "Rules follow karo, masti bhi karo! 😄",
      "Respect sabka, fun double! 🎉",
      "Stay active & enjoy the vibe! 🔥",
    ];

    // Random images (your Supaimg links)
    const imageLinks = [
      "https://i.supaimg.com/90e27f8c-cae4-4fd4-96a8-a7ab0275dd70.jpg",
      "https://i.supaimg.com/e847f151-772a-499d-ac8c-ef26368c4fb9.jpg",
      "https://i.supaimg.com/02382816-6fc2-4c03-a73e-6606b05bdee3.jpg"
    ];

    // Loop through each added participant (skip bot)
    for (const p of event.logMessageData.addedParticipants) {
      if (p.userFbId == api.getCurrentUserID()) continue;

      const userId = p.userFbId;
      const userName = p.fullName || "Member";
      const randomLine = welcomeLines[Math.floor(Math.random() * welcomeLines.length)];
      const imgUrl = imageLinks[Math.floor(Math.random() * imageLinks.length)];

      // Build message
      const msgBody =
        `🌸 Welcome @${userName} 🌸\n` +
        `Group: ${threadName}\n` +
        (memberCountNow ? `Aap is group ke ${memberCountNow}th member ho. 🎉\n` : "") +
        `\n💬 ${randomLine}\n` +
        `\n👑 My Owner: Aman Khan\n` +
        `🔗 FB: https://www.facebook.com/profile.php?id=100088677459075`;

      // Download image to a temp file
      let attachment = null;
      try {
        const fileName = `welcome_${userId}_${Date.now()}.jpg`;
        const filePath = path.join(__dirname, "cache", "joinNoti", fileName);

        const response = await axios.get(imgUrl, { responseType: "stream" });
        await new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        attachment = fs.createReadStream(filePath);

        // Send message with mention + attachment
        await api.sendMessage(
          {
            body: msgBody,
            mentions: [{ tag: `@${userName}`, id: userId }],
            attachment
          },
          threadID
        );

        // Cleanup file
        try { fs.unlinkSync(filePath); } catch {}
      } catch (dlErr) {
        // If image fails, send text-only message
        await api.sendMessage(
          {
            body: msgBody,
            mentions: [{ tag: `@${userName}`, id: userId }]
          },
          threadID
        );
      }
    }
  } catch (err) {
    // Log and move on (avoid breaking other modules)
    console.log("joinNoti error:", err?.message || err);
  }
};
