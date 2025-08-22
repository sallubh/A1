module.exports.config = {
  name: "groupscan",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "Aman", 
  description: "Quick scan of group permissions",
  commandCategory: "admin",
  usages: "groupscan",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  try {
    const processingMsg = await api.sendMessage("🔍 Quick scanning... (10 sec max)", threadID, messageID);
    
    // Get threads with limit to prevent hanging
    const threads = await Promise.race([
      api.getThreadList(25, null, ["INBOX"]), // Reduced from 50 to 25
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000)) // 8 sec timeout
    ]);
    
    const groupThreads = threads.filter(thread => thread.isGroup === true);
    const botID = api.getCurrentUserID();
    
    let workingGroups = [];
    let issueGroups = [];
    
    // Quick batch processing (max 15 groups to prevent hanging)
    const threadsToCheck = groupThreads.slice(0, 15);
    
    for (let i = 0; i < threadsToCheck.length; i++) {
      const thread = threadsToCheck[i];
      
      try {
        // Quick timeout for each thread info
        const threadInfo = await Promise.race([
          api.getThreadInfo(thread.threadID),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Thread timeout")), 2000))
        ]);
        
        const isAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
        const groupName = threadInfo.threadName || `Group ${i+1}`;
        const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;
        
        if (isAdmin) {
          workingGroups.push({ name: groupName, members: memberCount, id: thread.threadID });
        } else {
          issueGroups.push({ name: groupName, members: memberCount, id: thread.threadID });
        }
        
      } catch (error) {
        // If thread info fails, assume it's an issue group
        issueGroups.push({ 
          name: `Unknown Group ${i+1}`, 
          members: 0, 
          id: thread.threadID,
          error: "Info failed"
        });
      }
    }
    
    // Generate quick report
    let report = `📋 QUICK GROUP SCAN\n`;
    report += `═══════════════════\n`;
    report += `📊 Scanned: ${threadsToCheck.length}/${groupThreads.length} groups\n`;
    report += `✅ Working: ${workingGroups.length}\n`;
    report += `❌ Need Fix: ${issueGroups.length}\n\n`;
    
    // Show working groups
    if (workingGroups.length > 0) {
      report += `🟢 WORKING (AutoSeen OK):\n`;
      workingGroups.slice(0, 8).forEach((group, i) => {
        report += `${i+1}. ${group.name} (${group.members}👥)\n`;
      });
      if (workingGroups.length > 8) report += `... +${workingGroups.length - 8} more\n`;
      report += `\n`;
    }
    
    // Show issue groups  
    if (issueGroups.length > 0) {
      report += `🔴 NEED ADMIN PERMISSION:\n`;
      issueGroups.slice(0, 8).forEach((group, i) => {
        report += `${i+1}. ${group.name} (${group.members}👥)\n`;
      });
      if (issueGroups.length > 8) report += `... +${issueGroups.length - 8} more\n`;
      report += `\n`;
    }
    
    report += `🛠️ TO FIX ISSUES:\n`;
    report += `1. Use: /fixpermissions\n`;
    report += `2. Or manually make bot admin in red groups\n`;
    report += `3. Then AutoSeen will work everywhere! 🚀`;
    
    await api.editMessage(report, processingMsg.messageID);
    
  } catch (error) {
    console.error("GroupScan error:", error);
    return api.sendMessage(`❌ Scan failed: ${error.message}\n\nTry: /quickscan for faster results`, threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  return;
};
