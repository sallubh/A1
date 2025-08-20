const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "good night",
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
        "good night",
        "gn",
        "gud night",
        "night",
        "sweet dreams",
        "nind",
        "nind aa rahi hai",
        "nind ari",
        "sone",
        "sone ja"
    ];

    // ✅ Good Night Messages
    const gnMessages = [
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💫 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐑𝐚𝐚𝐭 𝐌𝐞 𝐒𝐢𝐫𝐟 𝐏𝐲𝐚𝐚𝐫𝐞 𝐒𝐚𝐩𝐧𝐞 𝐀𝐮𝐫 𝐒𝐮𝐤𝐨𝐨𝐧 𝐊𝐚 𝐒𝐚𝐚𝐲𝐚 𝐇𝐨 ✨",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 💖 𝐂𝐡𝐚𝐧𝐝 𝐀𝐮𝐫 𝐓𝐚𝐚𝐫𝐞 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐊𝐡𝐰𝐚𝐛𝐨𝐧 𝐊𝐢 𝐃𝐮𝐧𝐢𝐲𝐚 𝐊𝐨 𝐑𝐨𝐬𝐡𝐚𝐧 𝐊𝐚𝐫 𝐃𝐞 🌟",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌌 𝐃𝐢𝐥 𝐒𝐞 𝐃𝐮𝐚 𝐇𝐚𝐢 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐑𝐚𝐚𝐭 𝐌𝐞 𝐒𝐢𝐫𝐟 𝐊𝐡𝐮𝐬𝐡𝐢𝐲𝐚𝐧 𝐇𝐢 𝐊𝐡𝐮𝐬𝐡𝐢𝐲𝐚𝐧 𝐇𝐨 ❤️",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙 𝐇𝐚𝐫 𝐓𝐡𝐚𝐤𝐚𝐧 𝐌𝐢𝐭 𝐉𝐚𝐲𝐞 𝐀𝐮𝐫 𝐓𝐮𝐦 𝐒𝐢𝐫𝐟 𝐌𝐞𝐞𝐭𝐡𝐢 𝐍𝐞𝐞𝐧𝐝 𝐌𝐞 𝐊𝐡𝐨 𝐉𝐚𝐨 💫",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 😴 𝐊𝐚𝐥 𝐓𝐮𝐦𝐡𝐚𝐫𝐞 𝐋𝐢𝐲𝐞 𝐄𝐤 𝐑𝐨𝐬𝐡𝐚𝐧 𝐃𝐢𝐧 𝐀𝐮𝐫 𝐊𝐡𝐨𝐨𝐛𝐬𝐮𝐫𝐚𝐭 𝐋𝐚𝐦𝐡𝐞 𝐋𝐞𝐤𝐞 𝐀𝐚𝐲𝐞 🌄",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 💕 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐀𝐚𝐧𝐤𝐡𝐞𝐧 𝐁𝐚𝐧𝐝 𝐇𝐨𝐭𝐞 𝐇𝐢 𝐏𝐲𝐚𝐫𝐞 𝐒𝐚𝐩𝐧𝐞 𝐒𝐡𝐮𝐫𝐮 𝐇𝐨 𝐉𝐚𝐲𝐞 ✨",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌟 𝐒𝐮𝐤𝐨𝐨𝐧 𝐁𝐡𝐚𝐫𝐢 𝐍𝐞𝐞𝐧𝐝 𝐓𝐮𝐦𝐡𝐞 𝐇𝐚𝐫 𝐅𝐢𝐤𝐚𝐫 𝐒𝐞 𝐀𝐳𝐚𝐝 𝐊𝐚𝐫 𝐃𝐞 ❤️",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐌𝐮𝐬𝐤𝐚𝐚𝐧 𝐉𝐚𝐢𝐬𝐞 𝐒𝐚𝐩𝐧𝐨𝐧 𝐊𝐨 𝐁𝐡𝐢 𝐊𝐡𝐨𝐨𝐛𝐬𝐮𝐫𝐚𝐭 𝐁𝐚𝐧𝐚 𝐃𝐞 💫",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 💖 𝐂𝐡𝐚𝐧𝐝 𝐊𝐢 𝐇𝐚𝐥𝐤𝐢 𝐒𝐢 𝐑𝐨𝐬𝐡𝐧𝐢 𝐓𝐮𝐦𝐡𝐞 𝐏𝐲𝐚𝐫𝐞 𝐊𝐡𝐰𝐚𝐛𝐨𝐧 𝐌𝐞 𝐋𝐞 𝐉𝐚𝐲𝐞 🌌",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙 𝐊𝐚𝐥 𝐊𝐚 𝐃𝐢𝐧 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐇𝐚𝐫 𝐃𝐮𝐚 𝐊𝐨 𝐏𝐮𝐫𝐚 𝐊𝐚𝐫𝐧𝐞 𝐖𝐚𝐥𝐚 𝐇𝐨 ✨",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 💫 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐑𝐚𝐚𝐭 𝐏𝐲𝐚𝐫𝐢, 𝐓𝐮𝐦𝐡𝐚𝐫𝐞 𝐒𝐚𝐩𝐧𝐞 𝐊𝐡𝐨𝐨𝐛𝐬𝐮𝐫𝐚𝐭 𝐀𝐮𝐫 𝐓𝐮𝐦𝐡𝐚𝐫𝐚 𝐃𝐢𝐥 𝐒𝐮𝐤𝐨𝐨𝐧 𝐒𝐞 𝐁𝐡𝐚𝐫𝐚 𝐇𝐨 ❤️",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌌 𝐊𝐡𝐰𝐚𝐛𝐨𝐧 𝐊𝐚 𝐒𝐚𝐟𝐚𝐫 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐌𝐮𝐬𝐤𝐚𝐚𝐧 𝐒𝐞 𝐇𝐢 𝐑𝐨𝐬𝐡𝐚𝐧 𝐇𝐨 💕",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌟 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐀𝐚𝐧𝐤𝐡𝐨𝐧 𝐊𝐞 𝐒𝐚𝐩𝐧𝐞 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐙𝐢𝐧𝐝𝐚𝐠𝐢 𝐌𝐞 𝐇𝐚𝐪𝐢𝐪𝐚𝐭 𝐁𝐚𝐧 𝐉𝐚𝐲𝐞 ✨",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 ❤️ 𝐀𝐚𝐣 𝐊𝐢 𝐑𝐚𝐚𝐭 𝐓𝐮𝐦𝐡𝐚𝐫𝐢 𝐉𝐚𝐚𝐧 𝐊𝐞 𝐋𝐢𝐲𝐞 𝐒𝐢𝐫𝐟 𝐊𝐡𝐮𝐬𝐡𝐢𝐲𝐨 𝐊𝐚 𝐓𝐨𝐡𝐚𝐚𝐟𝐚 𝐇𝐨 🌙",
        "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙 𝐓𝐚𝐚𝐫𝐞 𝐓𝐮𝐦𝐡𝐞 𝐒𝐢𝐫𝐟 𝐌𝐞𝐞𝐭𝐡𝐢 𝐍𝐞𝐞𝐧𝐝 𝐀𝐮𝐫 𝐑𝐨𝐬𝐡𝐚𝐧 𝐒𝐚𝐩𝐧𝐞 𝐁𝐚𝐤𝐬𝐡𝐞 💫",
    ];

    // ✅ Image links
    const imgURL = [
        "https://i.supaimg.com/b4f95300-20e3-4996-b4be-73afec6a97d2.jpg",
        "https://i.supaimg.com/85eba5aa-3ff1-4285-8e5e-ab6315d48f0e.jpg",
        "https://i.supaimg.com/d280e406-fbf7-4708-9de9-53d746dcaa98.jpg",
        "https://i.supaimg.com/0eaaf9d1-6173-41c1-a73b-3bb2e6780583.jpg",
        "https://i.supaimg.com/2fd33cf2-0723-4adc-b894-ff08a89e5efc.jpg",
        "https://i.supaimg.com/16468ef8-2d70-403a-baff-2502a547b7e0.jpg",
        "https://i.supaimg.com/c3044080-38e9-4754-98c1-311fedca6968.jpg"
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

            api.setMessageReaction("🌌", messageID, () => {}, true);
        } catch (err) {
            console.error("Error sending image:", err);
        }
    }
};

module.exports.run = function() {};
