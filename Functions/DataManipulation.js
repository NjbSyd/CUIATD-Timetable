//Extracts the teacher schedule from the scrapped timetable data

function extractTeacherSchedule(data) {
   const teacherSchedule = {};
   Object.keys(data).forEach((className) => {
      for (let i = 0; i < data[className].length; i++) {
         const dayData = data[className][i];
         const dayName = dayData["Day"];
         if (Object.keys(dayData).length === 0) {
            continue;
         }
         for (const timeSlot in dayData) {
            if (dayData[timeSlot] !== null) {
               const teacherName = dayData[timeSlot].teacher;
               const className1 = className;
               if (!teacherSchedule[teacherName]) {
                  teacherSchedule[teacherName] = {_id: teacherName, schedule: []};
               }
               console.log(className1, dayName, timeSlot, dayData[timeSlot].classRoom, dayData[timeSlot].subject)
               teacherSchedule[teacherName].schedule.push({
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
   delete teacherSchedule.undefined;
   // Sort the schedule array for each teacher by day
   Object.keys(teacherSchedule).forEach((teacherName) => {
      teacherSchedule[teacherName].schedule.sort((a, b) => {
         const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
         return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
      });
   });

   return Object.values(teacherSchedule).map((teacher) => ({
      _id: teacher._id,
      schedule: teacher.schedule,
   }));
}


//Extracts the subject data from the scrapped timetable data
function extractSubjectData(timetable) {
   const subjectData = [];

   for (const classKey in timetable) {
      const course = classKey;
      const schedule = timetable[classKey];

      for (const day of schedule) {
         for (const timeSlotKey in day) {
            const timeSlot = day[timeSlotKey];

            if (timeSlot && timeSlot.subject) {
               const subject = timeSlot.subject;
               const teacher = timeSlot.teacher;

               const existingSubject = subjectData.find(
                   (data) => data.subject === subject && data.teacher === teacher
               );

               if (existingSubject) {
                  if (!existingSubject.courses.includes(course)) {
                     existingSubject.courses.push(course);
                  }
               } else {
                  subjectData.push({
                     subject,
                     teacher,
                     courses: [course]
                  });
               }
            }
         }
      }
   }

   subjectData.forEach((data) => {
      const subjectInitials = data.subject.split(' ').map(word => word[0]);
      const teacherInitials = data.teacher.split(' ').map(word => word[0]);
      data._id = [...teacherInitials, ...subjectInitials].join('');
   });

   return subjectData;
}

//Extract pure timetable data from the scrapped timetable data not containing any null time slots
function extractActualTimetable(timetable) {
   const transformedTimetable = {};
   for (const degree in timetable) {
      const degreeDays = timetable[degree];

      let hasValidDays = false;
      const transformedDegree = {};

      for (const day of degreeDays) {
         const transformedDay = {};
         const timeSlots = Object.keys(day).filter((key) => key !== "Day");

         let hasValidSlots = false;
         for (const slot of timeSlots) {
            if (day[slot]) {
               transformedDay[slot] = day[slot];
               hasValidSlots = true;
            }
         }

         if (hasValidSlots) {
            transformedDegree[day.Day] = transformedDay;
            hasValidDays = true;
         }
      }

      if (hasValidDays) {
         transformedTimetable[degree] = transformedDegree;
      }
   }

   return Object.entries(transformedTimetable).map(([degree, schedule]) => ({
      _id: degree,
      schedule
   }));
}

// Extract the list of classrooms from the timetable data
function extractClassrooms(timetable) {
   let classrooms = [];
   for (const degree in timetable) {
      const degreeDays = timetable[degree];
      for (const day of degreeDays) {
         const timeSlots = Object.values(day).filter((slot) => slot && slot.classRoom);
         for (const slot of timeSlots) {
            classrooms.push(slot.classRoom);
         }
      }
   }
   classrooms = [...new Set(classrooms)];
   return new Array(new Object({_id: "classrooms", classrooms}));
}

//export the functions to be used in other files
module.exports = {
   extractInfo,
   extractTeacherSchedule,
   extractSubjectData,
   extractClassrooms,
   extractActualTimetable
};


/*

 ~~~~~~~~~~~~~~~  Helper Functions Below  ~~~~~~~~~~~~~~~

 */


// Helper transform a valid timeSlot data to object
function extractInfo(str) {
   let info = str.split('<br>');
   let subject = info[0];
   let classRoom = info[1];
   let teacher = info[2].split('<b>')[1].split('</b>')[0];
   teacher = teacher.trim();
   return {subject, classRoom, teacher};
}

