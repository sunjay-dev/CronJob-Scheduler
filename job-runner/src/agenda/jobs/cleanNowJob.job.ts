const agenda = require("../agenda.js");

agenda.define("clean-now-jobs", async () => {
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const deleteCount = await agenda.cancel({
        type: "normal",
        repeatInterval: null,
        lastFinishedAt: { $lt: threshold }
    });

    console.log(`Cleaned up ${deleteCount} old one-time jobs`);
})