const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");
const { connectToMongoDatabase } = require("./MongoDB/MongoConfig");
const app = express();
const cors = require("cors");
const { storeLogs } = require("./Logs/StoreLogs");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use("/timetable", require("./Routes/TimetableData"));
app.use("/quotes", require("./Routes/Quotes"));
app.use("/web", require("./Routes/WebRoutes"));
app.use("/freeslots", require("./Routes/FreeSlots"));
app.use("/logs", require("./Routes/Logs"));

app
  .listen(3001, () => {
    console.log("Server Started on port 3000");
  })
  .on("error", (error) => {
    console.log(error);
    storeLogs(true, error.message);
  });

connectToMongoDatabase()
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

ScheduleCronJob();
