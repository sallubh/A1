module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aman Khan",
  description: "hi gửi sticker",
  commandCategory: "QTV BOX",
  usages: "[text]",
  cooldowns: 5
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = [ 
    "hello",
    "hi",
    "hyy",
    "hy",
    "@everyone",
    "Hi",
    "Hii",
    "Hello",
    "koi hai",
    "koi h",
    "hii",
    "helo",
    "HELLO"
  ];
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined", thread["hi"] == false) return
  else {
  if (KEY.includes(event.body.toLowerCase()) !== false) {
    let data = [
      "526214684778630",
    ];
    let sticker = data[Math.floor(Math.random() * data.length)];
    let moment = require("moment-timezone");
    let hours = moment.tz('Asia/Kolkata').format('HHmm');
    let session = (
    hours > 0001 && hours <= 400 ? "Happy Morning" : 
    hours > 401 && hours <= 700 ? "Sweet Morning" :
    hours > 701 && hours <= 1000 ? "Shining" :
    hours > 1001 && hours <= 1200 ? "Lunch" : 
    hours > 1201 && hours <= 1700 ? "Afternoon" : 
    hours > 1701 && hours <= 1800 ? "Morning" : 
    hours > 1801 && hours <= 2100 ? "Evening" : 
    hours > 2101 && hours <= 2400 ? "Late Night" : 
    "error");
    let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    let msg = {body: `Hi 🙋 ${name} 😗 Have a Good ${session} 🙂🤟`, mentions}
    api.sendMessage(msg, event.threadID, (e, info) => {
      setTimeout(() => {
        api.sendMessage({sticker: sticker}, event.threadID);
      }, 100)
    }, event.messageID)
  }
  }
}

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
		"successText": `${this.config.name} thành công`,
	},
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success!",
	}
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
	if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
	else data["hi"] = true;
	await Threads.setData(threadID, {
		data
	});
	global.data.threadData.set(threadID, data);
	return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}
