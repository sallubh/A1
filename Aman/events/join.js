module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "AMAN (Fixed for AK)",
  description: "Custom Welcome Message with Owner Info & Random Image",
  dependencies: { "fs-extra": "", "request": "" }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const fs = global.nodemodule["fs-extra"];
  const request = require("request");

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
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let newParticipant of event.logMessageData.addedParticipants) {
      let userID = newParticipant.userFbId;
      api.getUserInfo(parseInt(userID), (err, data) => {
        if (err) return console.log(err);

        var obj = Object.keys(data);
        var userName = data[obj].name;

        if (userID !== api.getCurrentUserID()) {
          nameArray.push(userName);
          mentions.push({ tag: userName, id: userID, fromIndex: 0 });
          memLength.push(participantIDs.length - i++);
          memLength.sort((a, b) => a - b);

          // ✅ Custom Welcome Message
          let msg = `🌹 Welcome ${userName} 🌹
            
👉 Group: ${threadName}
👉 Aap ab group ke ${memLength}th member ho 🎉

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

          // ✅ Send message with random image
          let callback = () =>
            api.sendMessage(
              { body: msg, attachment: fs.createReadStream(__dirname + "/cache/joinImg.jpg"), mentions },
              event.threadID,
              () => fs.unlinkSync(__dirname + "/cache/joinImg.jpg")
            );

          return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
            .pipe(fs.createWriteStream(__dirname + "/cache/joinImg.jpg"))
            .on("close", () => callback());
        }
      });
    }
  } catch (err) {
    return console.log("joinNoti error: " + err);
  }
};
