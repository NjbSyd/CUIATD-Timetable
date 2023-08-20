const express = require("express");
const logsRouter = express.Router();
const fs = require("fs");
const path = require("path");

logsRouter.get("/", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "Scheduler",
      "cronjob-logs.txt"
    );

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        // Replace escape characters with actual line breaks
        const formattedData = data.replace(/\r\n/g, "\n");
        res.status(200).send(formattedData);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = logsRouter;
