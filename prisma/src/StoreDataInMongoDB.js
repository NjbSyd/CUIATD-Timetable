const { prisma } = require("../index");

const AddSchedule = async (schedule) => {
  try {
    const existingDocInDb = await prisma.timetable.findFirst({
      where: {
        class_name: schedule.class_name,
        day: schedule.day,
        time_slot: schedule.time_slot,
      },
    });
    if (existingDocInDb) {
      // Check if any values have changed
      if (
        existingDocInDb.subject !== schedule.subject ||
        existingDocInDb.class_room !== schedule.class_room ||
        existingDocInDb.teacher !== schedule.teacher
      ) {
        await prisma.timetable.update({
          where: {
            id: existingDocInDb.id,
          },
          data: {
            subject: schedule.subject,
            class_room: schedule.class_room,
            teacher: schedule.teacher,
          },
        });
        return { class_name: schedule.class_name, status: "Updated" };
      } else {
        return { class_name: schedule.class_name, status: "Non Updated" };
      }
    } else {
      await prisma.timetable.create({
        data: schedule,
      });
      return { class_name: schedule.class_name, status: "New" };
    }
  } catch (error) {
    throw error;
  }
};

const RemoveOutdatedDocs = async (ActualTimetable) => {
  const deletedDocs = [];
  try {
    const prismaDocs = await prisma.timetable.findMany();

    for (const prismaDoc of prismaDocs) {
      const matchingDoc = ActualTimetable.find(
        (newDoc) =>
          newDoc.class_name === prismaDoc.class_name &&
          newDoc.day === prismaDoc.day &&
          newDoc.time_slot === prismaDoc.time_slot
      );

      if (!matchingDoc) {
        await prisma.timetable.delete({
          where: {
            id: prismaDoc.id,
          },
        });
        deletedDocs.push(prismaDoc.class_name);
      }
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
