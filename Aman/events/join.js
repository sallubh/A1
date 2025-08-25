module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "AMAN KHAN",
	description: "Welcome new members",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.run = async function({ api, event, Users, Threads }) {
	const { createReadStream } = global.nodemodule["fs-extra"];
	const { threadID } = event;

	// User ka name
	const name = global.data.userName.get(event.logMessageData.addedParticipants[0].userFbId) 
		|| await Users.getNameUser(event.logMessageData.addedParticipants[0].userFbId);

	// Thread info
	const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;

	// Welcome message
	var msg = (typeof data.customJoin == "undefined") ? 
		`🌸 Welcome ${name} 🌸\n\nEnjoy & Follow the Rules ✅` : data.customJoin;

	// Image links (Imgur)
	const imgurLinks = [
		"https://i.supaimg.com/90e27f8c-cae4-4fd4-96a8-a7ab0275dd70.jpg",
		"https://i.supaimg.com/e847f151-772a-499d-ac8c-ef26368c4fb9.jpg",
		"https://i.supaimg.com/02382816-6fc2-4c03-a73e-6606b05bdee3.jpg"
	];

	// Image attachments
	let attachments = [];
	for (let link of imgurLinks) {
		try {
			const imgStream = await global.utils.getStreamFromURL(link);
			attachments.push(imgStream);
		} catch (e) { console.log("Image error:", e); }
	}

	// Send message
	return api.sendMessage({ body: msg, attachment: attachments }, threadID);
};
