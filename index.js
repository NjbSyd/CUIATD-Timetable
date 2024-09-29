require("dotenv").config({
  path: "./.env",
});
const { storeLogs } = require("./Logs/StoreLogs");
const { prisma } = require("./prisma");
const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");

const app = express();
app.use(express.json());

app.use("/timetable", require("./Routes/TimetableData"));
app.use("/quotes", require("./Routes/Quotes"));
app.use("/freeslots", require("./Routes/FreeSlots"));
app.use("/logs", require("./Routes/Logs"));

app
  .listen(process.env.PORT || 3000, () => {
    console.log("Server Started on port 3000");
    storeLogs(false, "Server Started on port 3000", "Normal");
    // insertData();
    ScheduleCronJob();
  })
  .on("error", (error) => {
    console.log("🚀 ~ .on ~ error:", error);
    storeLogs(true, error.message);
  });

// const insertData = async () => {
//   try {
//     const user = {
//       class_name: "BBA 1A",
//       day: "Monday",
//       time_slot: "09:80 to 11:10",
//       subject: "Applications of Information and Communication Technologies",
//       class_room: "Computer LAB 4",
//       teacher: "Faculty-02 EEE",
//     };

//     prisma.timetable
//       .create({
//         data: user,
//       })
//       .then((data) => {
//         console.log("🚀 ~ insertData ~ data", data);
//       })
//       .catch((error) => {
//         console.log("🚀 ~ insertData ~ error", error);
//       });
//   } catch (error) {
//     console.log("🚀 ~ insertData ~ error", error);
//   }
// };
