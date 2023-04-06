const express = require('express');
const getClassTimetable = require("./getClassTimetables");

const app = express();

app.use(express.json());

app.listen(3000, () => console.log('Server started'));

app.get('/', async (req, res) => {
const {classes} = req.body;
  try {
    let timeTables=await getClassTimetable(classes);
    return res.status(200).send(timeTables);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }

});

