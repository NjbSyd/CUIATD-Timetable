const TimeTable = require("../Models/TimeTable");

const GetAllData = async () => {
  try {
    return await TimeTable.find();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  GetAllData,
};
