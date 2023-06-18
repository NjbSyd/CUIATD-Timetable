const { storeLogs } = require("./StoreLogs");
const { scrapClassTimetable } = require("../Puppeteer/ClassTimetablesScrapper");
const cron = require("node-cron");
const { AddSchedule } = require("../MongoDB/StoreDataInMongoDB");

const { extractTimetableData } = require("../Functions/DataManipulation");
const { connectToMongoDatabase } = require("../MongoDB/MongoConfig");

const ExtractData = async () => {
  try {
    console.log("Scrapping Started");
    const Timetables = await scrapClassTimetable();
    const ActualTimetable = extractTimetableData(Timetables);
    await connectToMongoDatabase();
    const promises = ActualTimetable.map(async (schedule) => {
      await AddSchedule(schedule);
    });
    await Promise.all(promises);
    storeLogs(false, "Scrapping completed Successfully");
  } catch (error) {
    console.log(error);
    storeLogs(true, error.message);
  }
};

const ScheduleCronJob = () => {
  cron.schedule("30 1 * * *", ExtractData);
};

module.exports = ScheduleCronJob;
