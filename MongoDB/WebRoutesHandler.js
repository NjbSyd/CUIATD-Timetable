const TimeTable = require("../Models/TimeTable");

const getDropdownData = async (req, res) => {
  let classNamesSet = new Set();
  let teachersSet = new Set();
  let subjectsSet = new Set();
  let timeSlotsSet = new Set();

  try {
    const response = await TimeTable.find(
      {},
      { class_name: 1, _id: 0, teacher: 1, subject: 1, time_slot: 1 }
    ); // projection

    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }

    response.forEach((item) => {
      classNamesSet.add(item.class_name);
      teachersSet.add(item.teacher);
      subjectsSet.add(item.subject);
      timeSlotsSet.add(item.time_slot);
    });

    const classNames = Array.from(classNamesSet);
    const teachers = Array.from(teachersSet);
    const subjects = Array.from(subjectsSet);
    const timeSlots = Array.from(timeSlotsSet);

    res.status(200).json({ classNames, teachers, subjects, timeSlots });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherSchedule = async (req, res) => {
  try {
    const response = await TimeTable.find({ teacher: req.params.teacherName });
    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSubjectSchedule = async (req, res) => {
  try {
    const response = await TimeTable.aggregate([
      {
        $match: { subject: req.params.subjectName },
      },
      {
        $group: {
          _id: "$class_name",
          teacher: { $first: "$teacher" },
          subject: { $first: "$subject" },
        },
      },
      {
        $project: {
          _id: 0,
          class_name: "$_id",
          teacher: 1,
          subject: 1,
        },
      },
      {
        $sort: { teacher: 1 },
      },
    ]);
    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getClassSchedule = async (req, res) => {
  try {
    const response = await TimeTable.find({ class_name: req.params.className });
    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getClassRoomSchedule = async (req, res) => {
  console.log(req.params);

  try {
    const response = await TimeTable.find({
      class_room: req.params.roomName,
      time_slot: req.params.timeSlot,
      day: req.params.day,
    });
    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDropdownData,
  getTeacherSchedule,
  getSubjectSchedule,
  getClassSchedule,
  getClassRoomSchedule,
};
