// Extracts data in the format of from the scrapped timetable data in the given format

/*

 {
 "class_name": "RMB 5M",
 "day": "Friday",
 "time_slot": "11:40 to 12:25",
 "subject": "Issues in Brand Management",
 "class_room": "A220",
 "teacher": " Dr. Mohammad Ali"
 },

 */
function extractTimetableData(timetableData) {
  // Define an empty array to store the extracted data
  const extractedData = [];

  for (const class_name of Object.keys(timetableData)) {
    const classData = timetableData[class_name];

    for (const dayData of Object.keys(classData[0]).length === 0
      ? classData.slice(1)
      : classData) {
      const day = dayData["Day"];

      for (const [timeSlot, details] of Object.entries(dayData).slice(1)) {
        if (details) {
          const subject = details["subject"];
          const classRoom = details["classRoom"];
          const teacher = details["teacher"];

          const extractedObject = {
            class_name: cleanup(class_name),
            day: cleanup(day),
            time_slot: cleanup(timeSlot),
            subject: cleanup(subject),
            class_room: cleanup(classRoom),
            teacher: cleanup(teacher),
          };
          extractedData.push(extractedObject);
        }
      }
    }
  }

  return extractedData;
}

// Finds the free slots in the timetable data
function findFreeSlots(timetableData) {
  const allTimeSlots = [
    "08:00 to 09:30",
    "09:40 to 11:10",
    "11:20 to 12:50",
    "13:40 to 15:10",
    "15:20 to 16:50",
    "17:00 to 18:30",
    "18:30 to 20:00",
    "20:00 to 21:30",
  ];

  const freeSlotsByRoom = {};

  for (const entry of timetableData) {
    const { class_name, day, time_slot, class_room } = entry;

    if (class_room) {
      if (!freeSlotsByRoom[class_room]) {
        freeSlotsByRoom[class_room] = {};
      }

      if (!freeSlotsByRoom[class_room][day]) {
        freeSlotsByRoom[class_room][day] = [];
      }

      freeSlotsByRoom[class_room][day].push(time_slot);
    }
  }

  const freeRoomSlots = {};

  for (const room in freeSlotsByRoom) {
    freeRoomSlots[room] = {};

    for (const day in freeSlotsByRoom[room]) {
      freeRoomSlots[room][day] = allTimeSlots.filter(
        (slot) => !freeSlotsByRoom[room][day].includes(slot)
      );
    }
  }

  return freeRoomSlots;
}

// Organizes the free slots by day
function organizeFreeSlotsByDay(freeSlotsByRoom) {
  const organizedSlots = {};

  for (const room in freeSlotsByRoom) {
    for (const day in freeSlotsByRoom[room]) {
      if (!organizedSlots[day]) {
        organizedSlots[day] = {};
      }

      if (!organizedSlots[day][room]) {
        organizedSlots[day][room] = freeSlotsByRoom[room][day];
      }
    }
  }
  // Remove rooms with empty arrays
  for (const day in organizedSlots) {
    for (const room in organizedSlots[day]) {
      if (organizedSlots[day][room].length === 0) {
        delete organizedSlots[day][room];
      }
    }
  }

  return organizedSlots;
}

// Sorts the free slots data by day and room
function sortFreeSlotsData(data) {
  const sortedData = {};

  // Sort days of the week in order (Monday to Friday)
  const sortedDays = Object.keys(data).sort((a, b) => {
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return daysOrder.indexOf(a) - daysOrder.indexOf(b);
  });

  for (const day of sortedDays) {
    sortedData[day] = {};

    // Sort room names alphabetically within each day
    const roomsData = data[day];
    const sortedRooms = Object.keys(roomsData).sort();

    for (const room of sortedRooms) {
      sortedData[day][room] = roomsData[room];
    }
  }
  return sortedData;
}

function removeLabData(jsonData) {
  const result = {};

  for (const day in jsonData) {
    const dayData = jsonData[day];
    const cleanedDayData = {};

    for (const room in dayData) {
      const roomNameNormalized = room.toLowerCase();
      if (
        !roomNameNormalized.includes("lab") &&
        !roomNameNormalized.includes("(l)") &&
        !roomNameNormalized.includes("lb")
      ) {
        cleanedDayData[room] = dayData[room];
      }
    }

    result[day] = cleanedDayData;
  }

  return result;
}

//export the functions to be used in other files
module.exports = {
  extractInfo,
  findFreeSlots,
  extractTimetableData,
  organizeFreeSlotsByDay,
  sortFreeSlotsData,
  removeLabData,
};

/*

 ~~~~~~~~~~~~~~~  Helper Functions Below  ~~~~~~~~~~~~~~~

 */

// Helper transform a valid timeSlot data to object
function extractInfo(str) {
  let info = str.split("<br>");
  let subject = info[0];
  let classRoom = info[1];
  let teacher = info[2].split("<b>")[1].split("</b>")[0];
  teacher = teacher.trim();
  return { subject, classRoom, teacher };
}

// Helper function to clean up the input fields from the html tags, special characters and extra spaces.
function cleanup(inputString) {
  return inputString
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&[^;]+;/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
