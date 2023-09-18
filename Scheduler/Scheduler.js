const { storeLogs } = require("../Logs/StoreLogs");
const { scrapClassTimetable } = require("../Scrapper/ClassTimetableScrapper");
const cron = require("node-cron");
const {
  AddSchedule,
  RemoveOutdatedDocs,
} = require("../MongoDB/StoreDataInMongoDB");
const { extractTimetableData } = require("../Functions/DataManipulation");
const { connectToMongoDatabase } = require("../MongoDB/MongoConfig");

const ExtractData = async () => {
  try {
    const updatedDocs = [];
    const newDocs = [];
    const nonUpdatedDocs = [];
    console.log("Scrapping Started");
    storeLogs(false, `Scrapping Started`);
    const Timetables = await scrapClassTimetable();
    const ActualTimetable = extractTimetableData(Timetables);
    await connectToMongoDatabase();
    const deletedDocs = await RemoveOutdatedDocs(ActualTimetable);
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
      `Scrapping completed Successfully! Updated: ${updatedDocs.length}, New: ${newDocs.length}, Existing: ${nonUpdatedDocs.length}, Deleted: ${deletedDocs.length}`
    );
  } catch (error) {
    storeLogs(true, error.message);
  }
};

const ScheduleCronJob = () => {
  cron.schedule("30 00 * * *", ExtractData); //5:30 AM PST
  cron.schedule("30 03 * * *", ExtractData); //8:30 AM PST
  cron.schedule("00 07 * * *", ExtractData); //12:00 PM PST
  cron.schedule("00 12 * * *", ExtractData); //05:00 PM PST
  cron.schedule("30 14 * * *", ExtractData); //07:30 PM PST
  console.log(
    "Cron Job Scheduled at 05:30 AM, 08:30 AM, 12:00 PM, 05:00 PM, 07:30 PM in Pakistan Standard Time"
  );
};

module.exports = ScheduleCronJob;
