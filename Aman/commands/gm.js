const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "good morning",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Aman Khan",
    description: "Send Good Night Image with random messages",
    commandCategory: "no prefix",
    cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;

    // ✅ Trigger words
    const triggerWords = [
        "good morning",
        "gm",
        "gud morning",
        "morning",
        "uth jao",
        "subha ho gayi ",
        "din nikal gaya",
        "sb so rahe",
    ];

    // ✅ Good Night Messages
    const gnMessages = [
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌸✨ 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐒𝐮𝐛𝐚𝐡 𝐊𝐡𝐮𝐬𝐡𝐢𝐲𝐨𝐧 𝐎𝐫 𝐏𝐲𝐚𝐫𝐢 𝐌𝐮𝐬𝐤𝐚𝐚𝐧 𝐒𝐞 𝐒𝐡𝐮𝐫𝐮 𝐇𝐨 💕",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 ☀️ 𝐀𝐚𝐣 𝐊𝐚 𝐃𝐢𝐧 𝐓𝐮𝐦𝐡𝐚𝐫𝐞 𝐋𝐢𝐲𝐞 𝐒𝐢𝐫𝐟 𝐑𝐨𝐬𝐡𝐚𝐧 𝐋𝐚𝐦𝐡𝐞 𝐋𝐞𝐤𝐞 𝐀𝐚𝐲𝐞 💫",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌼 𝐍𝐚𝐲𝐢 𝐔𝐦𝐞𝐞𝐝𝐞𝐢𝐧 𝐎𝐫 𝐍𝐚𝐲𝐞 𝐒𝐚𝐩𝐧𝐞 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐙𝐢𝐧𝐝𝐚𝐠𝐢 𝐌𝐞 𝐑𝐚𝐧𝐠 𝐁𝐡𝐚𝐫 𝐃𝐞 ✨",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 💖 𝐃𝐢𝐥 𝐇𝐞 𝐋𝐢𝐠𝐡𝐭 𝐑𝐚𝐤𝐡𝐨 𝐎𝐫 𝐒𝐦𝐢𝐥𝐞 𝐁𝐫𝐢𝐠𝐡𝐭 𝐊𝐚𝐫𝐨, 𝐀𝐚𝐣 𝐒𝐚𝐫𝐚 𝐃𝐢𝐧 𝐀𝐜𝐡𝐡𝐚 𝐇𝐨𝐠𝐚 🌟",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌷 𝐂𝐡𝐨𝐭𝐢 𝐂𝐡𝐨𝐭𝐢 𝐉𝐢𝐭𝐞𝐧 𝐈𝐤𝐭𝐡𝐢 𝐊𝐚𝐫𝐨, 𝐁𝐢𝐠 𝐒𝐦𝐢𝐥𝐞 𝐒𝐞 𝐃𝐢𝐧 𝐂𝐡𝐚𝐦𝐤𝐚𝐨 💕",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌞 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐂𝐨𝐟𝐟𝐞𝐞 𝐉𝐢𝐭𝐧𝐢 𝐇𝐨𝐭 𝐎𝐫 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐖𝐢𝐛𝐞 𝐉𝐢𝐭𝐧𝐢 𝐒𝐰𝐞𝐞𝐭 𝐑𝐚𝐡𝐞 💖",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 💫 𝐀𝐚𝐣 𝐇𝐚𝐫 𝐊𝐚𝐦 𝐀𝐬𝐚𝐧 𝐇𝐨 𝐎𝐫 𝐇𝐚𝐫 𝐏𝐚𝐥 𝐌𝐞 𝐊𝐡𝐮𝐬𝐡𝐢 𝐌𝐢𝐥𝐞 ✨",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌺 𝐉𝐨 𝐓𝐮𝐦 𝐂𝐡𝐚𝐡𝐨 𝐖𝐨 𝐌𝐢𝐥𝐞, 𝐉𝐨 𝐌𝐢𝐥𝐞 𝐔𝐬𝐦𝐞 𝐒𝐮𝐤𝐨𝐨𝐧 𝐌𝐞𝐡𝐬𝐨𝐨𝐬 𝐇𝐨 💞",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌈 𝐏𝐨𝐬𝐢𝐭𝐢𝐯𝐢𝐭𝐲 𝐎𝐧, 𝐃𝐨𝐮𝐭 𝐎𝐟𝐟, 𝐀𝐚𝐣 𝐊𝐞 𝐆𝐨𝐚𝐥𝐬 𝐖𝐢𝐧 𝐂𝐚𝐫𝐨 💪",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 💗 𝐌𝐞𝐞𝐭𝐡𝐢 𝐇𝐚𝐰𝐚, 𝐑𝐨𝐬𝐡𝐧𝐢 𝐊𝐢 𝐋𝐚𝐫𝐤𝐢𝐫, 𝐎𝐫 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐌𝐮𝐬𝐤𝐚𝐚𝐧 — 𝐏𝐞𝐫𝐟𝐞𝐜𝐭 𝐒𝐭𝐚𝐫𝐭 🌤️",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 ✨ 𝐊𝐡𝐮𝐝 𝐏𝐞 𝐘𝐚𝐤𝐞𝐞𝐧 𝐑𝐚𝐤𝐡𝐨, 𝐁𝐚𝐤𝐢 𝐃𝐮𝐧𝐢𝐲𝐚 𝐀𝐩𝐧𝐞 𝐀𝐚𝐩 𝐌𝐞 𝐒𝐞𝐭 𝐇𝐨 𝐉𝐚𝐲𝐞𝐠𝐢 💖",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌼 𝐇𝐚𝐫 𝐌𝐨𝐦𝐞𝐧𝐭 𝐊𝐨 𝐂𝐡𝐨𝐨𝐬𝐞 𝐇𝐚𝐩𝐩𝐢𝐧𝐞𝐬𝐬 𝐖𝐚𝐥𝐚 𝐓𝐮𝐫𝐧 𝐃𝐞𝐭𝐞 𝐑𝐚𝐡𝐨 💫",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌞 𝐓𝐮𝐦 𝐒𝐡𝐢𝐧𝐞 𝐊𝐚𝐫𝐨, 𝐁𝐚𝐤𝐢 𝐒𝐚𝐫𝐞 𝐑𝐚𝐬𝐭𝐞 𝐀𝐩𝐧𝐞 𝐀𝐚𝐩 𝐑𝐨𝐬𝐡𝐚𝐧 𝐇𝐨 𝐉𝐚𝐲𝐞𝐧𝐠𝐞 ✨",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 💖 𝐒𝐦𝐚𝐥𝐥 𝐒𝐭𝐞𝐩𝐬 𝐀𝐣 𝐁𝐢𝐠 𝐂𝐡𝐚𝐧𝐠𝐞𝐬 𝐊𝐚 𝐑𝐚𝐬𝐭𝐚 𝐁𝐚𝐧𝐚𝐭𝐞 𝐇𝐚𝐢𝐧 💪",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌷 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐄𝐧𝐞𝐫𝐠𝐲 𝐌𝐞𝐫𝐞 𝐃𝐢𝐧 𝐊𝐨 𝐁𝐡𝐢 𝐑𝐨𝐬𝐡𝐚𝐧 𝐊𝐚𝐫 𝐃𝐞𝐭𝐢 𝐇𝐚𝐢 💞",
  "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌟 𝐇𝐚𝐫 𝐂𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝐊𝐨 𝐒𝐦𝐢𝐥𝐞 𝐒𝐞 𝐇𝐢 𝐉𝐢𝐭𝐧𝐚 𝐇𝐚𝐢 — 𝐋𝐞𝐭’𝐬 𝐃𝐨 𝐈𝐭 ✨"
];

    // ✅ Image links
    const imgURL = [
      "https://i.supaimg.com/38256478-586a-45b4-bbd7-611455a06660.jpg",

      "https://i.supaimg.com/82b64181-bad6-4d05-9559-311198e65165.jpg",

      "https://i.supaimg.com/be1a9b98-b24c-49c4-be24-3731a07b8c10.jpg",

      "https://i.supaimg.com/7026bfe4-9186-4c47-83d4-5fce6531b55a.jpg",

      "https://i.supaimg.com/6007e248-1e4e-4312-a22d-8cd33949baa1.jpg",

      "https://i.supaimg.com/e13e7f82-5300-4a75-930f-dc33bc45ac8a.jpg",

      "https://i.supaimg.com/8d0e27fe-f532-4980-b519-4e7c0bb55c28.jpg",

      "https://i.supaimg.com/06ae9b68-ae49-43e7-9ee2-a3f2913166f1.jpg",

      "https://i.supaimg.com/d4f88aa3-01d2-45f0-b3ec-e2fd5793a86f.jpg",
    ];

    const lowerBody = body.toLowerCase();
    if (triggerWords.some(word => lowerBody.includes(word))) {
        try {
            // ✅ Get user name
            const userName = (await api.getUserInfo(senderID))[senderID].name;

            const folderPath = path.join(__dirname, "Aman");
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            const imgPath = path.join(folderPath, "gn.jpg");

            // ✅ Random image + message
            const randomLink = imgURL[Math.floor(Math.random() * imgURL.length)];
            const randomMsg = gnMessages[Math.floor(Math.random() * gnMessages.length)];

            // Download image
            const response = await axios.get(randomLink, { responseType: "arraybuffer" });
            fs.writeFileSync(imgPath, response.data);

            // ✅ Final message
            const finalMessage = `✨ ${userName},\n\n${randomMsg}\n\n*★᭄𝐎𝐰𝐧𝐞𝐫 𝐀 𝐊 ⚔️⏤͟͟͞͞★*`;

            // Send image
            api.sendMessage(
                {
                    body: finalMessage,
                    attachment: fs.createReadStream(imgPath)
                },
                threadID,
                () => {
                    fs.unlinkSync(imgPath); // Delete after sending
                },
                messageID
            );

            api.setMessageReaction("🌅", messageID, () => {}, true);
        } catch (err) {
            console.error("Error sending image:", err);
        }
    }
};

module.exports.run = function() {};
