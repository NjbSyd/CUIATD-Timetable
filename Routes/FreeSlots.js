const express = require("express");
const freeSlotsRouter = express.Router();
const { GetAllData } = require("../MongoDB/RequestHandler");
const compression = require("compression");

const {
  findFreeSlots,
  organizeFreeSlotsByDay,
  sortFreeSlotsData,
  removeLabData,
} = require("../Functions/DataManipulation");

freeSlotsRouter.use(compression());

freeSlotsRouter.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    const freeSlots = findFreeSlots(response);
    const freeSlotsByDay = organizeFreeSlotsByDay(freeSlots);
    const sortedFreeSlotsByDay = sortFreeSlotsData(freeSlotsByDay);
    const cleanedFreeSlots = removeLabData(sortedFreeSlotsByDay);
    res.status(200).json(cleanedFreeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = freeSlotsRouter;
