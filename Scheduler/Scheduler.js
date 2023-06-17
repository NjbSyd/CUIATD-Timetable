const { storeLogs } = require("./StoreLogs");
const { scrapClassTimetable } = require("../Puppeteer/ClassTimetablesScrapper");
const cron = require("node-cron");
const { AddSchedule } = require("../MongoDB/StoreDataInMongoDB");

const { extractTimetableData } = require("../Functions/DataManipulation");
const {
  connectToMongoDatabase,
  disconnectFromMongoDatabase,
} = require("../MongoDB/MongoConfig");

const ExtractData = async () => {
  try {
    console.log("Scrapping Started");
    const Timetables = await scrapClassTimetable(["BSE 6A"]);
    const ActualTimetable = extractTimetableData(Timetables);
    await connectToMongoDatabase();
    const promises = ActualTimetable.map(async (schedule) => {
      await AddSchedule(schedule);
    });
    await Promise.all(promises);
    storeLogs(false, "Scrapping completed Successfully");
    await disconnectFromMongoDatabase();
  } catch (error) {
    console.log(error);
    storeLogs(true, error.message);
    await disconnectFromMongoDatabase();
  }
};

const ScheduleCronJob = () => {
  cron.schedule("30 1 * * *", ExtractData);
};

module.exports = ScheduleCronJob;
