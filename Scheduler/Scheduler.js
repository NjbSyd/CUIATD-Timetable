const {storeLogs} = require("./StoreLogs");
const {scrapClassTimetable} = require("../Puppeteer/ClassTimetablesScrapper");
const cron = require("node-cron");
const {addSchedule} =require("../MongoDB/StoreDataInDb");




const {
   extractTimetableData

} = require("../Functions/DataManipulation");

const ExtractData = async () => {
   try {

      console.log("Scrapping Started")
      const Timetables = await scrapClassTimetable();
      const ActualTimetable = extractTimetableData(Timetables);
      const promises = ActualTimetable.map(async (schedule) => {
         await  addSchedule(schedule);
       });
       await Promise.all(promises);
      storeLogs(false, "Scrapping completed Successfully")
   } catch (error) {
      console.log(error);
      storeLogs(true, error.message);
   }
};

const ScheduleCronJob = () => {
   cron.schedule("30 1 * * *", ExtractData);
   ExtractData();
}


module.exports = ScheduleCronJob;
