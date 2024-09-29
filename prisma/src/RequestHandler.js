const { prisma } = require("../index");

const GetAllData = async () => {
  try {
    return await prisma.timetable.findMany();
  } catch (error) {
    throw error;
  }
};

const GetDistinctFieldValues = async (field) => {
  try {
    const distinctRecords = await prisma.timetable.findMany({
      select: {
        [field]: true,
      },
      distinct: [field],
    });
    return distinctRecords.map((record) => record[field]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  GetAllData,
  GetDistinctFieldValues,
};
