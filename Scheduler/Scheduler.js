const { storeLogs } = require("./StoreLogs");
const { scrapClassTimetable } = require("../Scrapper/ClassTimetableScrapper");
const cron = require("node-cron");
const { AddSchedule } = require("../MongoDB/StoreDataInMongoDB");
const { extractTimetableData } = require("../Functions/DataManipulation");
const { connectToMongoDatabase } = require("../MongoDB/MongoConfig");

const ExtractData = async () => {
  try {
    const updatedDocs = [];
    const newDocs = [];
    const nonUpdatedDocs = [];
    storeLogs(false, `Scrapping Started`);
    const Timetables = await scrapClassTimetable();
    const ActualTimetable = extractTimetableData(Timetables);
    await connectToMongoDatabase();
    const promises = ActualTimetable.map(async (schedule) => {
      const { class_name, status } = await AddSchedule(schedule);
      if (status === "Updated") {
        updatedDocs.push(class_name);
      } else if (status === "New") {
        newDocs.push(class_name);
      } else {
        nonUpdatedDocs.push(class_name);
      }
    });
    await Promise.all(promises);
    storeLogs(
      false,
      `\n\t\tUpdated Docs: ${updatedDocs.length}\n\t\tNew Docs: ${newDocs.length}\n\t\tNon Updated Docs: ${nonUpdatedDocs.length}`
    );
    storeLogs(false, `Scrapping completed Successfully`);
  } catch (error) {
    storeLogs(true, error.message);
  }
};

const ScheduleCronJob = () => {
  cron.schedule("30 00 * * *", ExtractData);
  cron.schedule("30 03 * * *", ExtractData);
  cron.schedule("00 07 * * *", ExtractData);
  cron.schedule("00 12 * * *", ExtractData);
  console.log(
    "Cron Job Scheduled at 05:30 AM, 08:30 AM, 12:00 PM, 05:00 PM in Pakistan Standard Time"
  );
};
module.exports = ScheduleCronJob;
