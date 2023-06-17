const mongoose = require("mongoose");

const timeTableSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },

  time_slot: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  class_room: {
    type: String,
    required: true,
  },

  teacher: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
    default: 1.0,
  },

  // "class_name": "RMB 5M",
  // "day": "Friday",
  // "time_slot": "11:40 to 12:25",
  // "subject": "Issues in Brand Management",
  // "class_room": "A220",
  // "teacher": " Dr. Mohammad Ali"
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
