const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");
const { connectToMongoDatabase } = require("./MongoDB/MongoConfig");
const app = express();

app.use(express.json());

app.use("/timetable", require("./Routes/TimetableData"));
app.use("/quotes", require("./Routes/Quotes"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});

connectToMongoDatabase()
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

ScheduleCronJob();
