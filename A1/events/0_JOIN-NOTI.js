module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "ARIF BABU",
  description: "Notify bots or people entering the group",
  dependencies: {
    "fs-extra": ""
  }
};
module.exports.run = async function({ api, event }) {

  const request = require("request");
  const { threadID } = event;
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${global.config.BOTNAME} 【 ${global.config.PREFIX} 】`, threadID, api.getCurrentUserID());
    return api.sendMessage(`┏━━━━━━┓\n    ARIF-BABU                    ♥️┄┅══❁🙂❁══┅┄♥️\n┗━━━━━━┛\n♥️✧═════════•❁❀❁•═════════✧♥️\n\n𒁍 [ BOT OWNER ]  →     ♥️ ARIF-BABU ♥️\n𒁍 [  NOTICE ] →KOI BOT KO GALI NHI DEGA AGAR KISI NA BINA FALTU KI GALI DIYA TO USKI ID BAND KAR DIYA JAYEGA\n𒁍 [ USER NOTICE ] → BOT KO BAR BAR ADD OR REMOVE NA KARO NAHI TO AAP KA GROUP BAN KIYA JAEGA 🙂✋\n𒁍 [ COMMANDS ]  →     #help \n\nTHIS BOT CREATER IS ARIF BABU\n\n𒁍 [ PREFIX ] →      # \n𒁍 [ FACEBOOK ID ] → https://www.facebook.com/profile.php?id=61553634015672&mibextid=kFxxJD\n𒁍 [ OWNER ] →  MR ARIF BABU\n𒁍 [ APPROVAL ] →   #request`, threadID);
    }
  else {
    try {
    const request = require("request");
      const fs = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};

      var mentions = [], nameArray = [], memLength = [], i = 0;

    let addedParticipants1 = event.logMessageData.addedParticipants;
        for (let newParticipant of addedParticipants1) {
   let userID = newParticipant.userFbId
api.getUserInfo(parseInt(userID), (err, data) => {
      if(err){ return console.log(err)}
     var obj = Object.keys(data);
    var userName = data[obj].name.replace("@", "");     	if (userID !== api.getCurrentUserID()) {  

        nameArray.push(userName);
        mentions.push({ tag: userName, id: userID, fromIndex: 0 });

        memLength.push(participantIDs.length - i++);
memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "┏━━━━━┓\n     ARIF-BABU              ✧═•❁𝗪𝗘𝗟𝗖𝗢𝗠𝗘❁•═✧\n┗━━━━━┛\n\n\nHELLO 𒁍 {name} {type}\nWELCOME TO {threadName}\n════════════════════════ ❁\nMY BOSS  𒁍 MR ARIF BABU 🌺\n════════════════════════ ❁\nFACEBOOK ID LINK 🔗 𒁍 https://www.facebook.com/profile.php?id=61553634015672&mibextid=kFxxJD\n════════════════════════ ❁\n𝖬𝖮𝖲𝖳 𝖶𝖤𝖫𝖢𝖮𝖬𝖤 𝖳𝖮 ARIF 𝖡𝖠𝖡U 𝖡𝖮𝖳\n════════════════════════ ❁\nBOT UPDATING 𒁍 MR ARIF BABU 🌺\n════════════════════════ ❁\n\n LATA TERI HI LAGI HA....................... 🌺\n NASHA SAREAAM HOGA....................... 🌺\n HAR LAMHA TUMHARE LABO PE.................. 🌺\n SIRF ARIF BABU KA HI NAAM HOGA.........🌺\nAAP IS GROUP KE{soThanhVien}Th Ho MEMBER HO...........🐥\n════════════════════════ ❁\n\nWISH YOU HAVE A GOOD {session}\n{time} ♥️🌺♥️🌺♥️": msg = threadData.customJoin;
      msg = msg
      .replace(/\{uName}/g, nameArray.join(', '))
      .replace(/\{type}/g, (memLength.length > 1) ?  'you' : 'Friend')
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);			

      var link = [
"https://i.imgur.com/AI8zow3.jpg",
"https://i.imgur.com/0grK57V.jpg",
"https://i.imgur.com/AI8zow3.jpg",
"https://i.imgur.com/0grK57V.jpg",
     ];
        var callback = () => api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + "/cache/leiamnashJ.jpg"), mentions }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/leiamnashJ.jpg"));
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/leiamnashJ.jpg")).on("close", () => callback());       
            }
})
        }
    }catch (err) {
            return console.log("ERROR: "+err);
    }
  }
                                                  }
