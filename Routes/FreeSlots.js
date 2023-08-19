const express = require("express");
const freeSlotsRouter = express.Router();
const { GetAllData } = require("../MongoDB/RequestHandler");

const {
  findFreeSlots,
  organizeFreeSlotsByDay,
} = require("../Functions/DataManipulation");

freeSlotsRouter.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    const freeSlots = findFreeSlots(response);
    const freeSlotsByDay = organizeFreeSlotsByDay(freeSlots);
    res.status(200).json(freeSlotsByDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = freeSlotsRouter;
