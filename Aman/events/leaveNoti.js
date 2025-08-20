module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "AMAN KHAN",
	description: "Notify bots or leavers",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { join } =  global.nodemodule["path"];
	const { threadID } = event;
	const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "Khud Hi Bagh gya" : "Admin Ny Gusse Me Remove Kar Diya 😐";
	const path = join(__dirname, "cache", "leaveGif");
	const gifPath = join(path, `bye.gif`);
	var msg, formPush

	if (existsSync(path)) mkdirSync(path, { recursive: true });

	(typeof data.customLeave == "undefined") ? msg = "𝐒𝐔𝐊𝐇𝐀𝐑 𝐇𝐀𝐈 𝐀𝐊 𝐓𝐇𝐀𝐑𝐊𝐇𝐈 𝐈𝐒 𝐆𝐑𝐎𝐔𝐏 𝐌𝐀𝐈𝐍 𝐊𝐀𝐌 𝐇𝐎 𝐆𝐘𝐀 𝐇𝐀𝐈 \n{name}\n𝐑𝐄𝐀𝐒𝐎𝐍: {type}." : msg = data.customLeave;
	msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

	if (existsSync(gifPath)) formPush = { body: msg, attachment: createReadStream(gifPath) }
	else formPush = { body: msg }
	
	return api.sendMessage(formPush, threadID);
}