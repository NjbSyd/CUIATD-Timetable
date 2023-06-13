const puppeteer = require("puppeteer");
const {JSDOM} = require("jsdom");
const fs = require("fs");
const CourseSemesterSectionScrapper = require("./ClassesListScrapper");
const {extractInfo} = require("../Functions/DataManipulation");


/*
 * extracts the timetable of the given classes
 * @param classes an array of classes to extract timetable of. If not provided, it will extract timetable of all classes
 * @returns JSON - { [ { { },...},...],...}
 * */
const scrapClassTimetable = async (classes = []) => {
  let timeTables = {};
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();

    // Navigate to the website and wait for it to load
    await page.goto("https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx");
    await page.waitForSelector('[name="ddlClasses"]');

    if (classes.length === 0) {
      classes = await CourseSemesterSectionScrapper();
    }
    for (let classNo = 0; classNo < classes.length; classNo++) {
      console.log(classes[classNo]);
      // Change the select element to "BSE 6A" and fire the onchange event
      await page.select('[name="ddlClasses"]', classes[classNo]);
      await page.waitForSelector("#gvTimeTable1");

      // Extract the table HTML content and output it to the console
      const tableHtml = await page.$eval("#gvTimeTable1", (table) => table.outerHTML);

      const dom = new JSDOM(tableHtml);
      const table = dom.window.document.querySelector("table");
      const header = table.querySelectorAll("th");
      const time = [];
      header.forEach((col, i) => {
        if (i > 0) time.push(col.textContent);
      });
      const rows = table.querySelectorAll("tr");
      const data = [];
      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        const rowData = {};
        let k = 0;
        cols.forEach((col, i) => {
          if (i === 0) {
            rowData["Day"] = col.textContent;
          } else if (col.innerHTML.split("<br>").length > 1) {
            const info = extractInfo(col.innerHTML.toString());
            if (col.colSpan > 1) {
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
    console.log(error);
    return timeTables;
  }
};

module.exports = {scrapClassTimetable};

