const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");


const app = express();
app.use(express.json());
ScheduleCronJob();
app.listen(3000, () => {
  console.log("Server Started on port 3000")
})