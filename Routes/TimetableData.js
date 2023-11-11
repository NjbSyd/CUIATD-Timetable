const express = require("express");
const compression = require("compression");
const { GetAllData } = require("../MongoDB/RequestHandler");
const { getLatestLog, storeLogs } = require("../Logs/StoreLogs");
const verifyAppVersion = require("../middleware/appVersion");
const timetableRouter = express.Router();

timetableRouter.use(compression());

timetableRouter.get("/", verifyAppVersion, async (req, res) => {
  try {
    storeLogs(
      false,
      `Timetable Requested from ${req.headers["user-agent"]}`,
      "Request"
    );
    const response = await GetAllData();
    res.status(200).json(response);
  } catch (error) {
    storeLogs(true, `Error in Timetable ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

timetableRouter.post("/shouldUpdate", async (req, res) => {
  try {
    const { lastSyncDate, version } = req.body;
    storeLogs(
      false,
      `Should Update Requested from ${req.headers["user-agent"]}, app version: ${version}`,
      "Request"
    );

    if (!lastSyncDate || lastSyncDate === "") {
      res
        .status(200)
        .send({ shouldUpdate: true, lastScrapDate: new Date().toJSON() });
      return;
    }
    const { log, changed, date } = getLatestLog();
    const lastScrapDate = new Date(`${date} ${log.split("M")[0]}M`);
    const lastSyncDateUTC = new Date(lastSyncDate.trim());
    const isScrapLatestThanSync = lastScrapDate >= lastSyncDateUTC;
    if (isScrapLatestThanSync) {
      if (changed) {
        res
          .status(200)
          .send({ shouldUpdate: true, lastScrapDate: lastScrapDate.toJSON() });
        return;
      }
    }
    res
      .status(200)
      .send({ shouldUpdate: false, lastScrapDate: lastScrapDate.toJSON() });
  } catch (error) {
    storeLogs(true, `Error in Should Update ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = timetableRouter;
