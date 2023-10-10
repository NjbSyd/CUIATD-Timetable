const fs = require("fs");

const logsFilePath = `./Logs/logs.json`;

const storeLogs = (isError, message, type = "Normal") => {
  try {
    const logType = isError ? "Failure" : type;
    const logDate = new Date().toJSON().slice(0, 10);
    const logTime = new Date().toLocaleTimeString();

    const logData = `${logTime}: ${message}`;

    fs.readFile(logsFilePath, (err, data) => {
      let logs = {};

      if (!err) {
        logs = JSON.parse(data);
      }

      if (!logs[logType]) {
        logs[logType] = {};
      }

      if (!logs[logType][logDate]) {
        logs[logType][logDate] = [];
      }

      logs[logType][logDate].push(logData);

      fs.writeFile(logsFilePath, JSON.stringify(logs, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const getLogsHTML = () => {
  try {
    const logsJSON = fs.readFileSync(logsFilePath);
    const logs = JSON.parse(logsJSON);

    const successLogs = logs["Success"];
    const noChangeLogs = logs["Normal"];
    const failureLogs = logs["Failure"];
    const request = logs["Request"];

    const getLogHTML = (logs) => {
      return Object.entries(logs)
        .map(
          ([date, messages]) => `
        <details class="log-date">
          <summary>${date}</summary>
            ${messages
              .map(
                (message) => `
              <pre class="console-log">${message}</pre>`
              )
              .join("")}
        </details>
      `
        )
        .join("");
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Logs</title>
          <style>
          
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

.success {
    background-color: #93f396; 
    border-radius: 5px;
    padding: 5px;
    color: #1e1e1e;
    font-weight: bold;
}

.nochanges {
    background-color: #f3f396;
    border-radius: 5px;
    padding: 5px;
    color: #1e1e1e;
    font-weight: bold;
}

.failure {
    background-color: #f39696;
    border-radius: 5px;
    padding: 5px;
    color: #1e1e1e;
    font-weight: bold;
}

.request{
    background-color: #f396f3;
    border-radius: 5px;
    padding: 5px;
    color: #1e1e1e;
    font-weight: bold;
}
.log-date {
    margin:0;
    font-size: 14px;
}
.log-date summary {
    cursor: pointer;
}

.console-log {
    background-color: #1e1e1e;
    color: #d4d4d4;
    padding: 10px;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
    margin: 2px;
    border-radius: 5px;
    line-height: 1;
    font-size: 12px;
    overflow: auto;
}

</style>
          </head>
        <body>
          <h1 class="success">Scrapping Logs</h1>
          ${getLogHTML(successLogs)}
          <h1 class="nochanges">Normal Logs</h1>
          ${getLogHTML(noChangeLogs)}
          <h1 class="request">Request Logs</h1>
          ${getLogHTML(request)}
          <h1 class="failure">Failure Logs</h1>
          ${getLogHTML(failureLogs)}
        </body>
      </html>
    `;
  } catch (error) {
    console.error(error);
    return `<p>Error retrieving logs: ${error.message}</p>`;
  }
};

function checkLatestLogForChanges(latestLog) {
  const regex = /(Updated|New|Deleted): (\d+)/g;
  let match;

  while ((match = regex.exec(latestLog)) !== null) {
    const count = parseInt(match[2], 10);
    if (count > 0 && count !== 0) {
      return true;
    }
  }

  return false;
}

function getLatestLog() {
  try {
    const logsJSON = fs.readFileSync(logsFilePath);
    const logs = JSON.parse(logsJSON);

    const successLogs = logs["Success"];
    const keys = Object.keys(successLogs);
    const latestDateLog = successLogs[keys[keys.length - 1]];
    const latestLog = latestDateLog[latestDateLog.length - 1];
    return {
      log: latestLog,
      changed: checkLatestLogForChanges(latestLog),
      date: keys[keys.length - 1],
    };
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getLogsHTML, storeLogs, getLatestLog };
