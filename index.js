const ScheduleCronJob = require("./Scheduler/Scheduler");
const express = require("express");
const {connectToMongoDB} = require("./MongoDB/MongoConfig");




const app = express();
app.use(express.json());
connectToMongoDB();
ScheduleCronJob();
// app.use("/",router);
app.listen(3000, () => {

    console.log("Server Started on port 3000")
})