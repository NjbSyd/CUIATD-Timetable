const db = require("./FirebaseConfig");

const addClassTimetable = async (data, className) => {
  await db
    .collection("Timetable")
    .doc(className)
    .set(data)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

const addTeacherSchedule = async (data, teacherName) => {
  await db
    .collection("TeacherSchedule")
    .doc(teacherName)
    .set({ data })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

const addRoughData = async (data) => {
  await db
    .collection("RoughData")
    .doc("RoughData")
    .set(data)
    .then(() => {
      console.log("Rough Data added");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { addClassTimetable, addTeacherSchedule, addRoughData };
