const express = require("express");
const compression = require("compression");
const { GetAllData } = require("../MongoDB/RequestHandler");
const { getLatestLog } = require("../Logs/StoreLogs");
const timetableRouter = express.Router();

timetableRouter.use(compression());

timetableRouter.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    console.log(getLatestLog());
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

timetableRouter.post("/shouldUpdate", async (req, res) => {
  try {
    const { lastSyncDate } = req.body;
    const { log, changed, date } = getLatestLog();
    const lastScrapDate = new Date(`${date} ${log.split("M")[0]}M`);
    const lastSyncDateUTC = new Date(lastSyncDate.trim());
    const isScrapLatestThanSync = lastScrapDate >= lastSyncDateUTC;
    if (!lastSyncDate) {
      res
        .status(200)
        .send({ shouldUpdate: true, lastScrapDate: lastScrapDate.toJSON() });
      return;
    }
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = timetableRouter;
