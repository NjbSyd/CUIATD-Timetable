const { connectToMongoDatabase } = require("./MongoDB/MongoConfig");
const { storeLogs } = require("./Logs/StoreLogs");
const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");

const app = express();
app.use(express.json());

app.use("/timetable", require("./Routes/TimetableData"));
app.use("/quotes", require("./Routes/Quotes"));
app.use("/web", require("./Routes/WebRoutes"));
app.use("/freeslots", require("./Routes/FreeSlots"));
app.use("/logs", require("./Routes/Logs"));

app
  .listen(process.env.PORT || 3000, () => {
    console.log("Server Started on port 3000");
    storeLogs(false, "Server Started on port 3000", "Normal");
  })
  .on("error", (error) => {
    console.log(error);
    storeLogs(true, error.message);
  });

connectToMongoDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
    storeLogs(false, "Connected to MongoDB", "Normal");
  })
  .catch((e) => console.log(e));

ScheduleCronJob();
