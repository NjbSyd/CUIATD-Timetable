const express = require("express");
const quotesRouter = express.Router();
const quotes = require("../Data/Quotes.json");
const { storeLogs } = require("../Logs/StoreLogs");
quotesRouter.get("/", async (req, res) => {
  try {
    const response = [];
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * quotes.length);
      if (response.includes(quotes[index])) {
        i--;
        continue;
      }
      response.push(quotes[index]);
    }
    storeLogs(
      false,
      `Quotes Requested from ${req.headers["user-agent"]}`,
      "Request"
    );
    res.status(200).json(response);
  } catch (error) {
    storeLogs(true, `Error in Quotes ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = quotesRouter;
