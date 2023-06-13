const {storeLogs} = require("./StoreLogs");
const {scrapClassTimetable} = require("../Puppeteer/ClassTimetablesScrapper");
const cron = require("node-cron");
const {
   extractTeacherSchedule,
   extractSubjectData,
   extractClassrooms,
   extractActualTimetable
} = require("../Functions/DataManipulation");
const {ConnectToMongoDB, AddManyDocuments, DisconnectFromMongo} = require("../MongoDB/MongoDB_Functions");

const ExtractData = async (classes = []) => {
   try {
      const Timetables = await scrapClassTimetable();
      const Teachers = extractTeacherSchedule(Timetables);
      const Subjects = extractSubjectData(Timetables);
      const Classrooms = extractClassrooms(Timetables);
      const ActualTimetable = extractActualTimetable(Timetables);

      await ConnectToMongoDB();
      await AddManyDocuments("Teachers", Teachers);
      await AddManyDocuments("Subjects", Subjects);
      await AddManyDocuments("ExtraData", Classrooms);
      await AddManyDocuments("ActualTimetable", ActualTimetable);
      await DisconnectFromMongo();
      storeLogs(false, "Scrapping completed Successfully")
   } catch (error) {
      storeLogs(true, error.message);
   }
};

const ScheduleCronJob = () => {
   cron.schedule("30 1 * * *", ExtractData);
}

module.exports = ScheduleCronJob;
