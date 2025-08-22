module.exports.config = {
  name: "groupscan",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Aman",
  description: "Scan all groups and check bot permissions",
  commandCategory: "admin",
  usages: "groupscan",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  try {
    // Send initial message
    const processingMsg = await api.sendMessage("🔍 Scanning all groups... Please wait", threadID, messageID);
    
    // Get all threads
    const threads = await api.getThreadList(50, null, ["INBOX"]);
    
    let workingGroups = [];
    let failedGroups = [];
    let totalGroups = 0;
    let processedCount = 0;
    
    // Filter only group threads
    const groupThreads = threads.filter(thread => thread.isGroup === true);
    totalGroups = groupThreads.length;
    
    console.log(`📊 Found ${totalGroups} groups to scan`);
    
    // Test each group
    for (const thread of groupThreads) {
      try {
        processedCount++;
        
        // Get thread info to check permissions
        const threadInfo = await api.getThreadInfo(thread.threadID);
        
        // Check if bot is admin
        const botID = api.getCurrentUserID();
        const botInfo = threadInfo.adminIDs.find(admin => admin.id === botID);
        const isAdmin = !!botInfo;
        
        // Test markAsRead permission
        let canMarkAsRead = false;
        try {
          // Try to mark as read (this won't actually mark anything if no new messages)
          await new Promise((resolve, reject) => {
            api.markAsRead(thread.threadID, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
          canMarkAsRead = true;
        } catch (error) {
          canMarkAsRead = false;
        }
        
        // Determine status
        const status = {
          threadID: thread.threadID,
          name: threadInfo.threadName || "Unnamed Group",
          memberCount: threadInfo.participantIDs.length,
          isAdmin: isAdmin,
          canMarkAsRead: canMarkAsRead,
          working: isAdmin && canMarkAsRead
        };
        
        if (status.working) {
          workingGroups.push(status);
        } else {
          failedGroups.push(status);
        }
        
        // Update progress every 5 groups
        if (processedCount % 5 === 0) {
          await api.editMessage(
            `🔍 Scanning... ${processedCount}/${totalGroups} completed\n⚡ Working: ${workingGroups.length}\n❌ Issues: ${failedGroups.length}`,
            processingMsg.messageID
          );
        }
        
        // Small delay to avoid API limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.log(`Error scanning thread ${thread.threadID}:`, error.message);
        failedGroups.push({
          threadID: thread.threadID,
          name: "Error getting info",
          memberCount: 0,
          isAdmin: false,
          canMarkAsRead: false,
          working: false,
          error: error.message
        });
      }
    }
    
    // Generate report
    let report = `📋 GROUP SCAN REPORT\n`;
    report += `═══════════════════════\n`;
    report += `📊 Total Groups: ${totalGroups}\n`;
    report += `✅ Working: ${workingGroups.length}\n`;
    report += `❌ Issues: ${failedGroups.length}\n\n`;
    
    // Working groups
    if (workingGroups.length > 0) {
      report += `🟢 WORKING GROUPS:\n`;
      workingGroups.slice(0, 10).forEach((group, index) => {
        report += `${index + 1}. ${group.name} (${group.memberCount} members)\n`;
      });
      if (workingGroups.length > 10) {
        report += `... and ${workingGroups.length - 10} more\n`;
      }
      report += `\n`;
    }
    
    // Failed groups with details
    if (failedGroups.length > 0) {
      report += `🔴 GROUPS WITH ISSUES:\n`;
      failedGroups.slice(0, 10).forEach((group, index) => {
        let reason = "";
        if (!group.isAdmin) reason += "Not Admin ";
        if (!group.canMarkAsRead) reason += "No Read Permission ";
        if (group.error) reason += `Error: ${group.error}`;
        
        report += `${index + 1}. ${group.name}\n`;
        report += `   👥 ${group.memberCount} members | Issue: ${reason}\n`;
      });
      if (failedGroups.length > 10) {
        report += `... and ${failedGroups.length - 10} more\n`;
      }
    }
    
    // Recommendations
    report += `\n💡 RECOMMENDATIONS:\n`;
    const notAdminCount = failedGroups.filter(g => !g.isAdmin).length;
    if (notAdminCount > 0) {
      report += `• Make bot admin in ${notAdminCount} groups\n`;
    }
    report += `• Working groups: AutoSeen will work perfectly\n`;
    report += `• Issue groups: Fix permissions first\n`;
    
    // Send final report
    await api.editMessage(report, processingMsg.messageID);
    
    // Save detailed report to console for admin
    console.log("\n" + "=".repeat(50));
    console.log("DETAILED GROUP SCAN REPORT");
    console.log("=".repeat(50));
    console.log("\nWORKING GROUPS:");
    workingGroups.forEach(group => {
      console.log(`✅ ${group.name} (ID: ${group.threadID}) - ${group.memberCount} members`);
    });
    console.log("\nFAILED GROUPS:");
    failedGroups.forEach(group => {
      console.log(`❌ ${group.name} (ID: ${group.threadID}) - Admin: ${group.isAdmin}, CanRead: ${group.canMarkAsRead}`);
    });
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("GroupScan error:", error);
    return api.sendMessage(`❌ Error scanning groups: ${error.message}`, threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  // This command doesn't need handleEvent
  return;
};
