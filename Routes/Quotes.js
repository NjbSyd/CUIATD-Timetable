const express = require("express");
const quotesRouter = express.Router();
const quotes = require("../Data/Quotes.json");
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
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = quotesRouter;
