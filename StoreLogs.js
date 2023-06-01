const fs = require("fs");

exports.storeLogs = (errorName, errorMessage) => {
  try {
    const date = new Date();
    const log = `
        Date:${date.getDay()}:${date.getMonth() + 1}:${date.getFullYear()}
        Time:${date.getHours()}:${date.getMinutes()} :${date.getSeconds()}
        ErrorName:  ${errorName}
        Message: ${errorMessage}
        ---------------------------------------------------------------------------------
        `;

    fs.appendFileSync("./Logs.txt", log);
  } catch (error) {
    console.log(error);
  }
};
