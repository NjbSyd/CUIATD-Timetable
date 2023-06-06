const fs = require('fs');

module.exports = function getClassesTimetableFromLocalJSON(classes) {
  try {
    const data = require("../Output/Timetable.json");
    if (classes.length === 0) return data;
    const timetable = {};
    classes.forEach((className) => {
      timetable[className] = data[className];
    });
    return timetable;
  } catch (err) {
    return `Timetable data not found. Please try again after 01:30 UTC`;
  }
}