function extractTeacherSchedule(data) {
  const teacherSchedule = {};

  Object.keys(data).forEach((className) => {
    for (let i = 0; i < data[className].length; i++) {
      const dayData = data[className][i];
      if (Object.keys(dayData).length === 0) {
        continue;
      }
      for (const timeSlot in dayData) {
        if (dayData[timeSlot] !== null) {
          const teacherName = dayData[timeSlot].teacher;
          const className1 = className;
          const dayName = getDayName(i); // Get the day name based on the day index

          if (!teacherSchedule[teacherName]) {
            teacherSchedule[teacherName] = [];
          }
          teacherSchedule[teacherName].push({
            className: className1,
            day: dayName, // Add the day name to the teacher's schedule
            timeSlot,
            classRoom: dayData[timeSlot].classRoom,
            subject: dayData[timeSlot].subject
          });
        }
      }
    }
  });
  return teacherSchedule;
}

// Helper function to get the day name based on index
function getDayName(index) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return daysOfWeek[index-1];
}


function findClassName(schedule) {
  let data = [];
  for (const className in schedule) {
    for (const classObj of schedule[className]) {
      if (classObj["13:35 to 14:20"] &&
          classObj["13:35 to 14:20"]["classRoom"].includes("Z218")) {
        data.push({className, day: classObj["Day"]})
      }
    }
  }
  data = [...new Set(data)]
  return data;
}

function extractAllSubjects(data) {
  let subjects = [];
  Object.values(data).forEach((week) => {
    week.forEach((day) => {
      Object.values(day).forEach((slot) => {
        if (slot !== null && typeof slot === "object" && "subject" in slot) {
          subjects.push(slot.subject);
        }
      });
    });
  });
  subjects = [...new Set(subjects)]
  return subjects;
}

function extractAllTeachers(data) {
  let teachers = [];
  Object.values(data).forEach((week) => {
    week.forEach((day) => {
      Object.values(day).forEach((slot) => {
        if (slot !== null && typeof slot === "object" && "teacher" in slot) {
          teachers.push(slot.teacher);
        }
      });
    });
  });
  teachers = [...new Set(teachers)]
  return teachers;
}

function noOfClasses(JsonData, reqDay) {
  let no = 0;
  Object.keys(JsonData).map((key, index) => {
    JsonData[key].forEach((day) => {
      if (day.Day === reqDay) {
        Object.values(day).forEach((slot) => {
          if (slot !== null && typeof slot === "object" && "teacher" in slot)
            no++;
        });
      }
    })
  })
  console.log(no)
}

function extractAllClassRooms(data) {
  let classRooms = [];
  Object.values(data).forEach((week) => {
    week.forEach((day) => {
      Object.values(day).forEach((slot) => {
        if (slot !== null && typeof slot === "object" && "classRoom" in slot) {
          classRooms.push(slot.classRoom);
        }
      });
    });
  });
  classRooms = [...new Set(classRooms)]
  classRooms.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });
  return classRooms;
}

//transform daily schedule of a class, remove saturday and undefined
function transformSchedule(schedule) {
  const data = {};
  schedule.forEach(daySchedule => {
    const day = daySchedule.Day;
    delete daySchedule.Day;
    data[day] = daySchedule;
  });
  delete data[undefined];
  delete data['Saturday'];
  return data;
}

//transform a valid class table data to object
function extractInfo(str) {
  let info = str.split('<br>');
  let subject = info[0];
  let classRoom = info[1];
  let teacher = info[2].split('<b>')[1].split('</b>')[0];
  teacher = teacher.trim();
  return {subject, classRoom, teacher};
}

module.exports = {
  extractInfo,
  transformSchedule,
  extractTeacherSchedule,
  findClassName,
  extractAllSubjects,
  extractAllTeachers,
  extractAllClassRooms,
  noOfClasses
};