const fs = require("fs");

exports.storeLogs = (isError, message) => {
  try {
    const log = `${
      isError ? "Failure" : "Success"
    }: ${new Date()}: ${message}\n`;
    fs.appendFileSync("./Scheduler/cronjob-logs.txt", log);
  } catch (error) {
    console.log(error);
  }
};
