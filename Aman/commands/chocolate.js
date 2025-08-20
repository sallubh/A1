const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "chocolate",
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
        "chocolate",
        "CHOCOLATE",
        "Choklet",
        "choklet",
        "choklait",
        "CHOKLAIT",

    ];

    // ✅ Good Night Messages
    const gnMessages = [
   "𝐘𝐞 𝐋𝐨 𝐌𝐞𝐫𝐢 𝐓𝐚𝐫𝐚𝐟 𝐒𝐞 𝐂𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 🍫",
   "𝐘𝐞 𝐋𝐨 𝐂𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 𝐊𝐡𝐚𝐨 𝐀𝐮𝐫 𝐊𝐡𝐮𝐬𝐡 𝐇𝐨 𝐉𝐚𝐨 😘🍫✨",
   "𝐘𝐞 𝐓𝐨 𝐁𝐬 𝐂𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 𝐇𝐚𝐢, 𝐀𝐚𝐩 𝐊𝐞 𝐋𝐢𝐲𝐞 𝐓𝐨 𝐉𝐚𝐚𝐧 𝐁𝐡𝐢 𝐇𝐚𝐳𝐢𝐫 𝐇𝐚𝐢 ❤️🍫✨",

];

    // ✅ Image links
    const imgURL = [
      "https://i.supaimg.com/188873ad-3e4f-467b-ae46-8a7419ff2588.jpg",

"https://i.supaimg.com/5b245d50-85cb-40b3-8d94-67e46fa7488a.jpg",

"https://i.supaimg.com/629d08eb-acc4-4079-a347-7dadb401ea1a.jpg",

"https://i.supaimg.com/037e3655-c5c4-4bae-bb77-e9dce061f19d.jpg",
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

            api.setMessageReaction("🍫", messageID, () => {}, true);
        } catch (err) {
            console.error("Error sending image:", err);
        }
    }
};

module.exports.run = function() {};
