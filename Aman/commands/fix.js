module.exports.config = {
  name: "fix",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Aman",
  description: "Fix bot permissions in all groups",
  commandCategory: "admin",
  usages: "fixpermissions [auto/manual]",
  cooldowns: 15
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const mode = args[0] || "auto";
  
  try {
    const processingMsg = await api.sendMessage("🔧 Starting permission fix process...", threadID, messageID);
    
    // Get all group threads
    const threads = await api.getThreadList(50, null, ["INBOX"]);
    const groupThreads = threads.filter(thread => thread.isGroup === true);
    
    let fixedCount = 0;
    let failedCount = 0;
    let alreadyWorkingCount = 0;
    let processedCount = 0;
    
    const botID = api.getCurrentUserID();
    
    for (const thread of groupThreads) {
      try {
        processedCount++;
        
        // Get thread info
        const threadInfo = await api.getThreadInfo(thread.threadID);
        const threadName = threadInfo.threadName || "Unnamed Group";
        
        // Check if bot is already admin
        const isAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);
        
        if (isAdmin) {
          alreadyWorkingCount++;
          console.log(`✅ Already admin in: ${threadName}`);
        } else {
          console.log(`🔧 Trying to fix permissions in: ${threadName}`);
          
          if (mode === "auto") {
            // Method 1: Try to send a permission request message
            try {
              await api.sendMessage(
                "🤖 Bot Permission Request\n\n" +
                "Please make me admin to enable all features:\n" +
                "1. Go to group settings\n" +
                "2. Select 'Make Admin'\n" +
                "3. Choose this bot account\n\n" +
                "This will enable AutoSeen and other features! 🚀",
                thread.threadID
              );
              
              fixedCount++;
              console.log(`📤 Permission request sent to: ${threadName}`);
              
            } catch (error) {
              // Method 2: Try alternative approach
              try {
                await api.changeNickname("🤖 Bot (Need Admin)", thread.threadID, botID);
                await api.sendMessage("🤖 Please make me admin for full features!", thread.threadID);
                fixedCount++;
                console.log(`📝 Nickname changed in: ${threadName}`);
              } catch (nickError) {
                failedCount++;
                console.log(`❌ Failed to contact: ${threadName}`);
              }
            }
          } else {
            // Manual mode - just report
            failedCount++;
            console.log(`📝 Manual fix needed: ${threadName} (ID: ${thread.threadID})`);
          }
        }
        
        // Update progress
        if (processedCount % 3 === 0) {
          await api.editMessage(
            `🔧 Processing... ${processedCount}/${groupThreads.length}\n` +
            `✅ Fixed/Requested: ${fixedCount}\n` +
            `⚡ Already Working: ${alreadyWorkingCount}\n` +
            `❌ Failed: ${failedCount}`,
            processingMsg.messageID
          );
        }
        
        // Delay to avoid spam
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        failedCount++;
        console.log(`Error processing thread ${thread.threadID}:`, error.message);
      }
    }
    
    // Final report
    let report = `🔧 PERMISSION FIX REPORT\n`;
    report += `═══════════════════════\n`;
    report += `📊 Total Groups Scanned: ${groupThreads.length}\n`;
    report += `✅ Permission Requests Sent: ${fixedCount}\n`;
    report += `⚡ Already Working: ${alreadyWorkingCount}\n`;
    report += `❌ Failed to Contact: ${failedCount}\n\n`;
    
    if (mode === "auto") {
      report += `📤 ACTION TAKEN:\n`;
      report += `• Sent permission request messages to non-admin groups\n`;
      report += `• Changed nickname to indicate admin need\n`;
      report += `• Groups where bot is already admin are working fine\n\n`;
    }
    
    report += `💡 NEXT STEPS:\n`;
    report += `• Check groups where permission requests were sent\n`;
    report += `• Ask group admins to make bot admin\n`;
    report += `• Run /groupscan again to verify fixes\n`;
    report += `• AutoSeen will work in groups where bot is admin\n\n`;
    report += `🔄 Re-run: /fixpermissions to try again`;
    
    await api.editMessage(report, processingMsg.messageID);
    
  } catch (error) {
    console.error("FixPermissions error:", error);
    return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  return;
};
