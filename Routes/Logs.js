const express = require("express");
const { getLogsHTML } = require("../Logs/StoreLogs");
const logsRouter = express.Router();

logsRouter.get("/", async (req, res) => {
  try {
    const logsHtml = getLogsHTML();
    const htmlResponse = `
      <!DOCTYPE html>
      ${logsHtml}
    `;

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = logsRouter;
