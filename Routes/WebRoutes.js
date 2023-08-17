const { getDropdownData, getTeacherSchedule, getSubjectSchedule, getClassSchedule, getClassRoomSchedule } = require("../MongoDB/WebRoutesHandler");
const Router = require("express").Router();
Router.get("/", getDropdownData);
Router.get("/teacher/:teacherName", getTeacherSchedule)
Router.get("/subject/:subjectName", getSubjectSchedule)
Router.get("/class/:className", getClassSchedule)
Router.get("/room/roomName/:roomName/timeSlot/:timeSlot/day/:day", getClassRoomSchedule)

module.exports = Router;









