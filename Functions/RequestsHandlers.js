module.exports = function getClassesTimetableFromLocalJSON(classes) {
  const data = require("../Output/Timetable.json");
  if (classes.length === 0) return data;
  const timetable = {};
  classes.forEach((className) => {
    timetable[className] = data[className];
  });
  return timetable;
}