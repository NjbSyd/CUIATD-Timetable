const express = require('express');
const getClassTimetable = require("./Puppeteer/getClassTimetables");
const addClassTimetable = require("./Firebase/Functions");
const ExtractData = require("./Scheduler/Scheduler");
const {storeLogs} = require("./Scheduler/StoreLogs");
const cron = require("node-cron");
const app = express();

app.use(express.json());

app.listen(3000, () => console.log('Server started'));

app.get('/', async (req, res) => {
  const {classes} = req.body;
  try {
    await getClassTimetable(classes);
    storeLogs(false,"Scrapping completed Successfully")
    return res.status(200).send("Scrapping completed Successfully");
  } catch (err) {
    storeLogs(true, err.message);
    return res.status(500).send(err.message);
  }
});

cron.schedule("30 1 * * *", ExtractData); // runs every day at 6:30 PST
