const express = require("express");
const { GetAllData } = require("../MongoDB/RequestHandler");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await GetAllData();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
