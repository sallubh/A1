const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.3",
  credits: "AMAN (Fixed for AK)",
  description: "Custom Welcome Message with Owner Info & Random Image",
  dependencies: { "fs-extra": "", "request": "" }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // ✅ Bot join hone par
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${global.config.BOTNAME} 【 ${global.config.PREFIX} 】`, threadID, api.getCurrentUserID());
    return api.sendMessage(
      `┏━━━━━━┓
   👑 AK-BOT 👑
┗━━━━━━┛

🤖 BOT Owner: Aman Khan
⚠️ Bot ko gali mat dena warna block ho jaoge
📌 Prefix: ${global.config.PREFIX}
🔗 Owner FB: https://www.facebook.com/profile.php?id=100088677459075`,
      threadID
    );
  }

  // ✅ Member join hone par
  try {
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);

    for (let newParticipant of event.logMessageData.addedParticipants) {
      let userID = newParticipant.userFbId;

      if (userID !== api.getCurrentUserID()) {
        let userInfo = await api.getUserInfo(userID);
        let userName = userInfo[userID].name;

        let memberCount = participantIDs.length;

        // ✅ Custom Welcome Message
        let msg = `🌹 Welcome ${userName} 🌹
            
👉 Group: ${threadName}
👉 Aap ab group ke ${memberCount}th member ho 🎉

💬 Line: "Dosti hi zindagi ka asli khazana hai"  
(Ye part aap multiple lines se replace kar sakte ho)

👑 Owner: Aman Khan
🔗 FB: https://www.facebook.com/profile.php?id=100088677459075`;

        // ✅ Random Image Links
        let link = [
          "https://i.supaimg.com/90e27f8c-cae4-4fd4-96a8-a7ab0275dd70.jpg",
          "https://i.supaimg.com/e847f151-772a-499d-ac8c-ef26368c4fb9.jpg",
          "https://i.supaimg.com/02382816-6fc2-4c03-a73e-6606b05bdee3.jpg"
        ];

        let chosenImg = link[Math.floor(Math.random() * link.length)];

        let filePath = __dirname + "/cache/joinImg.jpg";

        request(encodeURI(chosenImg))
          .pipe(fs.createWriteStream(filePath))
          .on("close", () => {
            api.sendMessage(
              {
                body: msg,
                attachment: fs.createReadStream(filePath),
                mentions: [{ tag: userName, id: userID }]
              },
              threadID,
              () => fs.unlinkSync(filePath)
            );
          });
      }
    }
  } catch (err) {
    console.log("joinNoti error: " + err);
  }
};
