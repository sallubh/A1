module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "AMAN KHAN",
  description: "Notify when someone joins the group",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    return api.sendMessage("Hello 👋, bot ab is group me aa gaya hai!", threadID);
  }

  const path = join(__dirname, "cache", "joinGif");
  if (!existsSync(path)) mkdirSync(path, { recursive: true });

  // Example welcome images (tum apna imgur/supaimg link yahan dal sakte ho)
  const imgLinks = [
    "https://i.supaimg.com/90e27f8c-cae4-4fd4-96a8-a7ab0275dd70.jpg",
    "https://i.supaimg.com/e847f151-772a-499d-ac8c-ef26368c4fb9.jpg",
    "https://i.supaimg.com/02382816-6fc2-4c03-a73e-6606b05bdee3.jpg"
  ];

  for (let user of event.logMessageData.addedParticipants) {
    const name = (await Users.getNameUser(user.userFbId)) || "Member";

    let msg = `🌸 Welcome ${name} 🌸\nHumare group me aapka swagat hai! 🎉`;

    api.sendMessage({
      body: msg,
      attachment: imgLinks.map(link => api.sendMessage({ body: "", attachment: link }, threadID))
    }, threadID);
  }
};
