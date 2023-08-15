const express = require("express");
const { GetAllData } = require("../MongoDB/RequestHandler");
const timetableRouter = express.Router();

timetableRouter.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = timetableRouter;
