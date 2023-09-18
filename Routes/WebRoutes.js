const {
  getDropdownData,
  getTeacherSchedule,
  getSubjectSchedule,
  getClassSchedule,
  getClassRoomSchedule,
  getFreeSlots,
} = require("../MongoDB/WebRoutesHandler");
const Router = require("express").Router();
const cors = require("cors");
const {
  teacherValidator,
  subjectValidator,
  roomValidator,
  classValidator,
} = require("../middleware/validator");

Router.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

Router.get("/", getDropdownData);
Router.get("/teacher/:teacherName", teacherValidator, getTeacherSchedule);
Router.get("/subject/:subjectName", subjectValidator, getSubjectSchedule);
Router.get("/class/:className", classValidator, getClassSchedule);
Router.get(
  "/roomName/:roomName/timeSlot/:timeSlot/day/:day",
  roomValidator,
  getClassRoomSchedule
);
Router.get("/freeSlots/day/:day", getFreeSlots);

module.exports = Router;
