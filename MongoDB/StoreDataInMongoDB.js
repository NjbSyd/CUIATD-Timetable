const TimeTable = require("../Models/TimeTable");
const { GetAllData } = require("./RequestHandler");

const AddSchedule = async (schedule) => {
  try {
    const filter = {
      class_name: schedule.class_name,
      day: schedule.day,
      time_slot: schedule.time_slot,
    };

    const existingDocInDb = await TimeTable.findOne(filter);

    if (existingDocInDb) {
      // Check if any values have changed
      let needsUpdate = false;

      if (
        existingDocInDb.subject !== schedule.subject ||
        existingDocInDb.class_room !== schedule.class_room ||
        existingDocInDb.teacher !== schedule.teacher
      ) {
        needsUpdate = true;
      }

      if (needsUpdate) {
        const update = {
          $set: {
            subject: schedule.subject,
            class_room: schedule.class_room,
            teacher: schedule.teacher,
            __v: existingDocInDb.__v + 0.1,
          },
        };
        await TimeTable.updateOne(filter, update);
        return { class_name: schedule.class_name, status: "Updated" };
      } else {
        return { class_name: schedule.class_name, status: "Non Updated" };
      }
    } else {
      const newSchedule = new TimeTable(schedule);
      await newSchedule.save();
      return { class_name: schedule.class_name, status: "New" };
    }
  } catch (error) {
    throw error;
  }
};

const RemoveOutdatedDocs = async (ActualTimetable) => {
  const deletedDocs = [];
  try {
    const mongoDocs = await GetAllData();
    for (const newDoc of ActualTimetable) {
      const matchingDocIndex = mongoDocs.findIndex(
        (doc) =>
          doc.class_name === newDoc.class_name &&
          doc.day === newDoc.day &&
          doc.time_slot === newDoc.time_slot
      );

      // If a match is found, remove the document from both arrays
      if (matchingDocIndex !== -1) {
        mongoDocs.splice(matchingDocIndex, 1);
      }
    }

    // Delete any remaining outdated documents from the database
    for (const outdatedDoc of mongoDocs) {
      await TimeTable.deleteOne({
        class_name: outdatedDoc.class_name,
        day: outdatedDoc.day,
        time_slot: outdatedDoc.time_slot,
      });
      deletedDocs.push(outdatedDoc.class_name);
    }
    return deletedDocs;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  AddSchedule,
  RemoveOutdatedDocs,
};
