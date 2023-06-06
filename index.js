const express = require('express');
const ExtractData = require("./Scheduler/Scheduler");
const cron = require("node-cron");
const getClassesTimetableFromLocalJSON = require("./Functions/RequestsHandlers");
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log(`Server started at ${new Date()}`);
});

app.get('/', async (req, res) => {
  const {classes} = req.body;
  try {
    const data = getClassesTimetableFromLocalJSON(classes);
    if (typeof data === "string")
      return res.status(500).send(data);
    else
      return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


cron.schedule("30 1 * * *", ExtractData);