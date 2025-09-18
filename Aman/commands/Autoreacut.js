module.exports.config = {
    name: "react",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Aman Khan",
    description: "Messages ko automatically react karta hai",
    commandCategory: "Fun",
    usages: "Auto react on all messages",
    cooldowns: 0
};

// React emojis array
const reactEmojis = [
    "❤️", "😍", "😘", "🥰", "😊", "😂", "🤣", "😎", 
    "🔥", "💯", "👍", "👌", "✨", "💖", "💕", "🌟",
    "😋", "🤗", "😉", "🥳", "🎉", "💪", "🙌", "👏"
];

// Keywords for specific reactions
const keywordReactions = {
    "love": ["❤️", "😍", "💖", "💕"],
    "funny": ["😂", "🤣", "😄", "😆"],
    "good": ["👍", "👌", "💯", "✨"],
    "fire": ["🔥", "💯", "😎", "🌟"],
    "cute": ["🥰", "😘", "💖", "😊"],
    "nice": ["👍", "😊", "✨", "👌"],
    "awesome": ["🔥", "💯", "🌟", "🙌"],
    "cool": ["😎", "🔥", "👌", "💯"],
    "haha": ["😂", "🤣", "😄", "😆"],
    "wow": ["😮", "🤩", "✨", "🌟"],
    "thanks": ["🙏", "😊", "💖", "🤗"],
    "sorry": ["😔", "🥺", "💔", "😢"]
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    
    return api.sendMessage(
        "🎭 Auto React Bot Active!\n\n" +
        "✅ Har message pe automatically react karega\n" +
        "🎯 Smart keyword detection\n" +
        "⚡ No storage required\n\n" +
        "𝙊𝙬𝙣𝙚𝙧 𝘼𝙆",
        threadID, messageID
    );
};

// Auto react functionality - NO STORAGE
module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID, body, messageID, type } = event;
    
    // Only process message events
    if (type !== "message" && type !== "message_reply") {
        return;
    }
    
    // Skip bot's own messages
    if (senderID === api.getCurrentUserID()) {
        return;
    }
    
    // Skip commands (optional - remove ye line agar commands pe bhi react karna hai)
    if (body && typeof body === 'string' && (body.startsWith("/") || body.startsWith("!"))) {
        return;
    }
    
    try {
        let emojiToUse;
        
        // Smart emoji selection based on keywords
        let foundKeywordEmoji = null;
        
        if (body && typeof body === 'string') {
            const lowerBody = body.toLowerCase();
            
            // Check for keyword matches
            for (const [keyword, emojis] of Object.entries(keywordReactions)) {
                if (lowerBody.includes(keyword)) {
                    foundKeywordEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    break;
                }
            }
        }
        
        // Use keyword emoji or random emoji
        emojiToUse = foundKeywordEmoji || reactEmojis[Math.floor(Math.random() * reactEmojis.length)];
        
        // Add small random delay to make it natural
        setTimeout(() => {
            api.setMessageReaction(emojiToUse, messageID, (err) => {
                if (err && !err.toString().includes("rate limit")) {
                    console.error(`React: Failed to react:`, err.message);
                }
            }, true);
        }, 300 + Math.random() * 1500); // Random delay 0.3-1.8 seconds
        
    } catch (error) {
        // Silent error handling
        if (!error.toString().includes("rate limit") && !error.toString().includes("ECONNRESET")) {
            console.error("React Event Error:", error.message);
        }
    }
};
