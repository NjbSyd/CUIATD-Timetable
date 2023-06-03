const fs = require("fs");

exports.storeLogs = (isError, errorMessage) => {
  try {
  
    const log = `${isError?"Failure":"Success"}: ${new Date()}: ${errorMessage} \n `;
    fs.appendFileSync("./Logs.txt", log);
  } catch (error) {
    console.log(error);
  }
};
