const corn = require("node-cron");
const {storeLogs} = require("./StoreLogs");
const getClassTimetable = require("./Puppeteer/getClassTimetables");

const ExtractData = async () => {
  console.log("job-started");

  try {
    await getClassTimetable([]);
  } catch (error) {
    storeLogs(error.name, error.message);
  }
};

corn.schedule("0 0 * * *", ExtractData); // runs every 12 Am

module.exports = ExtractData;
