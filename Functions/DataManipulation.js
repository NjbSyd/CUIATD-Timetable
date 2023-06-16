
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
 
 
 
     for (const dayData of Object.keys(classData[0]).length ===0?classData.slice(1):classData) {
       const day = dayData['Day'];
 
       for (const [timeSlot, details] of Object.entries(dayData).slice(1)) {
         if (details) {
           const subject = details['subject'];
           const classRoom = details['classRoom'];
           const teacher = details['teacher'];
 
           const extractedObject = {
             class_name: class_name,
             day: day,
             time_slot: timeSlot,
             subject: subject,
             class_room: classRoom,
             teacher: teacher,
           };
           extractedData.push(extractedObject);
         }
       }
     }
   }
 
 
 return extractedData;
 }




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
   extractActualTimetable,
   extractTimetableData,
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

