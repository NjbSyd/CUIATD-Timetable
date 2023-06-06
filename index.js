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
      return res.status(200).send(data);
  } catch (err) {
      return res.status(500).send(err.message);
  }
});

// app.get('/cancel', async (req, res) => {
//   const {auth, id} = req.body;
//   if (auth === "123456789") {
//     activeRequests[id].status(200).send("Cancelled");
//     setCancelRequest(true);
//     delete activeRequests[id];
//     return res.status(200).send("Cancelled");
//   }
// });

cron.schedule("30 1 * * *", ExtractData);