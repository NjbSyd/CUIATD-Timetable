const express = require("express");
const freeSlotsRouter = express.Router();
const { GetAllData } = require("../MongoDB/RequestHandler");

const {
  findFreeSlots,
  organizeFreeSlotsByDay,
  sortFreeSlotsData,
} = require("../Functions/DataManipulation");

freeSlotsRouter.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    const freeSlots = findFreeSlots(response);
    const freeSlotsByDay = organizeFreeSlotsByDay(freeSlots);
    const sortedFreeSlotsByDay = sortFreeSlotsData(freeSlotsByDay);
    res.status(200).json(sortedFreeSlotsByDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = freeSlotsRouter;
