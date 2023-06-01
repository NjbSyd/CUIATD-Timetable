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
  // Sort the schedule array for each teacher by day
  Object.keys(teacherSchedule).forEach((teacherName) => {
    teacherSchedule[teacherName].sort((a, b) => {
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });
  });
  return teacherSchedule;
}

// Helper function to get the day name based on index
function getDayName(index) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return daysOfWeek[index-1];
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
};