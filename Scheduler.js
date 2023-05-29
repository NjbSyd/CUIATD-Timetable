const corn =require("node-cron");

const getClassTimetable = require("./Puppeteer/getClassTimetables");

const ExtractData = async()=>{
    console.log("job-started")
   await  getClassTimetable([]);

}

corn.schedule("0 0 * * *",ExtractData); // runs every 12 Am 


module.exports = ExtractData;