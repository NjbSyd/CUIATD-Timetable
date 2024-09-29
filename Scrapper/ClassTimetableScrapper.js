const { chromium } = require("playwright");
const CourseSemesterSectionScrapper = require("./ClassesListScrapper");
const { extractInfo } = require("../Functions/DataManipulation");
const cheerio = require("cheerio");

/*
 * Scrapes the timetable of the given classes from the website and returns an object containing the timetable of each class as an array of objects
 * */
const scrapClassTimetable = async (classes = []) => {
  let timeTables = {};
  try {
    const browser = await chromium.launch({ headless: false }); // Use headless: false if you want to see the browser UI
    const page = await browser.newPage();

    await page.goto("https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx");
    await page.waitForSelector('[name="ddlClasses"]');

    if (classes.length === 0) {
      classes = await CourseSemesterSectionScrapper();
    }

    for (let classNo = 0; classNo < classes.length; classNo++) {
      console.log(classes[classNo]);
      await page.selectOption('[name="ddlClasses"]', classes[classNo]);
      await page.waitForSelector("#gvTimeTable1");

      // Extract the entire table HTML content
      let tableHtml = await page.innerHTML("#gvTimeTable1");
      tableHtml =
        '<table class="table1" cellspacing="0" rules="all" border="2" id="gvTimeTable1" style="color:Black;border-color:#000000;border-width:2px;border-style:solid;font-\n' +
        'family:Arial;font-size:Small;width:99%;border-collapse:collapse;table-layout: fixed;">\n' +
        "                " +
        tableHtml +
        "</table>";

      const $ = cheerio.load(tableHtml);

      const header = $("th:not(:first-child)");
      const time = [];
      header.each((i, col) => {
        time.push($(col).text());
      });

      const rows = $("tr");
      const data = [];
      rows.each((_, row) => {
        const cols = $(row).find("td");
        const rowData = {};
        let k = 0;
        cols.each((i, col) => {
          if (i === 0) {
            rowData["Day"] = $(col).text();
          } else if ($(col).html().split("<br>").length > 1) {
            const info = extractInfo($(col).html().toString());
            if ($(col).attr("colspan") > 1) {
              rowData[time[k]] = info;
              rowData[time[k + 1]] = info;
              k += 2;
            } else {
              rowData[time[k]] = info;
              k++;
            }
          } else {
            rowData[time[k]] = null;
            k++;
          }
        });
        if (Object.keys(rowData).length > 0 && rowData["Day"] !== "Saturday") {
          data.push(rowData);
        }
      });
      timeTables[classes[classNo]] = data;
    }

    await browser.close();
    return timeTables;
  } catch (error) {
    throw error;
  }
};

module.exports = { scrapClassTimetable };
