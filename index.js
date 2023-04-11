const express = require('express');
const getClassTimetable = require("./Puppeteer/getClassTimetables");
const addClassTimetable = require("./Firebase/Functions");
const app = express();

app.use(express.json());

app.listen(3000, () => console.log('Server started'));

app.get('/', async (req, res) => {
  const {classes} = req.body;
  try {
    await getClassTimetable(classes);
    return res.status(200).send("Scrapping completed Successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }

});

