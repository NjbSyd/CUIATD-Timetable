const TimeTable = require("../Models/TimeTable");
const { storeLogs } = require("../Logs/StoreLogs");

const getDropdownData = async (req, res) => {
  let classNamesSet = new Set();
  let teachersSet = new Set();
  let subjectsSet = new Set();
  let timeSlotsSet = new Set();
  let classRoomsSet = new Set();
  try {
    const response = await TimeTable.find(
      {},
      {
        class_name: 1,
        _id: 0,
        teacher: 1,
        subject: 1,
        time_slot: 1,
        class_room: 1,
      }
    ).sort({
      class_name: 1,
      teacher: 1,
      subject: 1,
      time_slot: 1,
      class_room: 1,
    });

    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }

    response.forEach((item) => {
      classNamesSet.add(item.class_name);
      teachersSet.add(item.teacher);
      subjectsSet.add(item.subject);
      timeSlotsSet.add(item.time_slot);
      classRoomsSet.add(item.class_room);
    });

    const classNames = Array.from(classNamesSet);
    const teachers = Array.from(teachersSet);
    const subjects = Array.from(subjectsSet);
    const timeSlots = Array.from(timeSlotsSet);
    const classRooms = Array.from(classRoomsSet);

    res
      .status(200)
      .json({ classNames, teachers, subjects, timeSlots, classRooms });
  } catch (error) {
    storeLogs(true, error.message);
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
    storeLogs(true, error.message);
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
          _id: "$class_room",
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
    storeLogs(true, error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getClassSchedule = async (req, res) => {
  try {
    const { className } = req.params;

    const response = await TimeTable.aggregate([
      {
        $match: { class_name: className },
      },
      {
        $group: {
          _id: "$day",
          day_schedule: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { time_slot: 1 }, // Corrected field name here
      },
      {
        $group: {
          _id: null,
          days: {
            $push: {
              k: "$_id", // Use day name as key
              v: "$day_schedule",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$days" },
        },
      },
    ]);

    if (!response || response.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const formattedResponse = response[0];
    const sortedResponse = {};
    Object.keys(formattedResponse)
      .sort((a, b) => {
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        return days.indexOf(a) - days.indexOf(b);
      })
      .forEach((key) => {
        sortedResponse[key] = formattedResponse[key];
      });
    res.status(200).json(sortedResponse);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getClassRoomSchedule = async (req, res) => {
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

const getFreeSlots = async (req, res) => {
  try {
    const response = await TimeTable.find({ day: req.params.day });
    if (!response) {
      return res.status(404).json({ message: "No data found" });
    }
    const allSlotsinRoom = [
      "08:00 to 09:30",
      "09:40 to 11:10",
      "11:20 to 12:50",
      "13:40 to 15:10",
      "15:20 to 16:50",
      "17:00 to 18:30",
      "18:30 to 20:00",
      "20:00 to 21:30",
    ];

    const bookedTimeSlots = {};
    for (const entry of response) {
      const { class_room, time_slot } = entry;
      if (!bookedTimeSlots[class_room]) {
        bookedTimeSlots[class_room] = [];
      }
      bookedTimeSlots[class_room].push(time_slot);
    }
    const freeRoomSlots = {};
    for (const room in bookedTimeSlots) {
      freeRoomSlots[room] = allSlotsinRoom.filter(
        (timeSlot) => !bookedTimeSlots[room].includes(timeSlot)
      );
    }
    res.status(200).json(freeRoomSlots);
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
  getFreeSlots,
};
