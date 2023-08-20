const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");
const { connectToMongoDatabase } = require("./MongoDB/MongoConfig");
const app = express();
const cors=require("cors")

app.use(express.json());

app.use(cors(
  {
origin: ['http://localhost:5173'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }

))


app.use("/timetable", require("./Routes/TimetableData"));
app.use("/quotes", require("./Routes/Quotes"));
app.use("/web", require("./Routes/WebRoutes"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});

connectToMongoDatabase()
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

ScheduleCronJob();
