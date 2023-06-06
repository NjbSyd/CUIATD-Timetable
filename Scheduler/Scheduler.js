const {storeLogs} = require("./StoreLogs");
const {scrapClassTimetable} = require("../Puppeteer/ClassTimetablesScrapper");

const ExtractData = async () => {
  try {
    await scrapClassTimetable();
    storeLogs(false,"Scrapping completed Successfully")
  } catch (error) {
    storeLogs(true, error.message);
  }
};

module.exports = ExtractData;
