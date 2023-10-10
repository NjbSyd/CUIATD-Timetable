const express = require("express");
const { getLogsHTML, storeLogs } = require("../Logs/StoreLogs");
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
    storeLogs(true, `Error in Logs ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = logsRouter;
