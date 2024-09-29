const { prisma } = require("../prisma/index");
const { storeLogs } = require("../Logs/StoreLogs");
const { scrapClassTimetable } = require("../Scrapper/ClassTimetableScrapper");
const { extractTimetableData } = require("../Functions/DataManipulation");
const cron = require("node-cron");

const ExtractData = async () => {
  try {
    console.log("Scraping Started");
    const timetables = await scrapClassTimetable();
    const actualTimetable = extractTimetableData(timetables);

    const result = await prisma.$transaction(async (prisma) => {
      // Get existing records
      const existingRecords = await prisma.timetable.findMany();

      // Prepare data for batch operations
      const toCreate = [];
      const toUpdate = [];
      const unchanged = [];

      for (const schedule of actualTimetable) {
        const existing = existingRecords.find(
          (r) =>
            r.class_name === schedule.class_name &&
            r.day === schedule.day &&
            r.time_slot === schedule.time_slot
        );

        if (!existing) {
          toCreate.push(schedule);
        } else if (
          existing.subject !== schedule.subject ||
          existing.class_room !== schedule.class_room ||
          existing.teacher !== schedule.teacher
        ) {
          toUpdate.push({
            ...schedule,
            id: existing.id,
            version: existing.version + 0.1,
          });
        } else {
          unchanged.push(schedule.class_name);
        }
      }

      // Perform batch operations
      const created = await prisma.timetable.createMany({
        data: toCreate,
        skipDuplicates: true,
      });

      const updated = await Promise.all(
        toUpdate.map((record) =>
          prisma.timetable.update({
            where: { id: record.id },
            data: record,
          })
        )
      );

      // Remove outdated records
      const toDelete = existingRecords.filter(
        (record) =>
          !actualTimetable.some(
            (schedule) =>
              schedule.class_name === record.class_name &&
              schedule.day === record.day &&
              schedule.time_slot === record.time_slot
          )
      );

      const deleted = await prisma.timetable.deleteMany({
        where: {
          id: {
            in: toDelete.map((record) => record.id),
          },
        },
      });

      return {
        created: created.count,
        updated: updated.length,
        unchanged: unchanged.length,
        deleted: deleted.count,
      };
    });

    // Log results
    const message =
      result.created > 0 || result.updated > 0 || result.deleted > 0
        ? `Scraping completed Successfully! Updated: ${result.updated}, New: ${result.created}, Existing: ${result.unchanged}, Deleted: ${result.deleted}`
        : `Scraping completed Successfully! No changes found`;

    storeLogs(
      false,
      message,
      result.created > 0 || result.updated > 0 || result.deleted > 0
        ? "Success"
        : "Normal"
    );

    console.log(message);
  } catch (error) {
    storeLogs(true, error.message);
    console.error("Error in ExtractData:", error);
  }
};

const ScheduleCronJob = () => {
  cron.schedule("05 04 * * *", ExtractData); //5:30 AM PST
  cron.schedule("30 00 * * *", ExtractData); //5:30 AM PST
  cron.schedule("30 03 * * *", ExtractData); //8:30 AM PST
  cron.schedule("00 07 * * *", ExtractData); //12:00 PM PST
  cron.schedule("00 12 * * *", ExtractData); //05:00 PM PST
  cron.schedule("30 14 * * *", ExtractData); //07:30 PM PST
  console.log(
    "Cron Job Scheduled at 05:30 AM, 08:30 AM, 12:00 PM, 05:00 PM, 07:30 PM in Pakistan Standard Time"
  );
};

module.exports = ScheduleCronJob;
