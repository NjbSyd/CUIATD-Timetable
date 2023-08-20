const { getDropdownData, getTeacherSchedule, getSubjectSchedule, getClassSchedule, getClassRoomSchedule } = require("../MongoDB/WebRoutesHandler");
const Router = require("express").Router();
const {teacherValidator,subjectValidator,roomValidator,classValidator}=require("../middleware/validator")
Router.get("/", getDropdownData);
Router.get("/teacher/:teacherName",teacherValidator, getTeacherSchedule)
Router.get("/subject/:subjectName",subjectValidator, getSubjectSchedule)
Router.get("/class/:className",classValidator, getClassSchedule)
Router.get("/roomName/:roomName/timeSlot/:timeSlot/day/:day",roomValidator, getClassRoomSchedule)

module.exports = Router;









