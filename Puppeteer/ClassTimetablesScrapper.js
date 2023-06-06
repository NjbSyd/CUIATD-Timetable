const puppeteer = require("puppeteer");
const {JSDOM} = require("jsdom");
const fs = require("fs");
const classesListScrapper = require("./ClassesListScrapper");
const {
  addClassTimetable,
  addTeacherSchedule,
} = require("../Firebase/Functions");
const {
  transformSchedule,
  extractInfo,
  extractTeacherSchedule,
} = require("../Functions/DataManipulation");

// let cancelRequest = false;
//
// function setCancelRequest(value) {
//   cancelRequest = value;
// }
//
// function getCancelRequest() {
//   return cancelRequest;
// }

const scrapClassTimetable = async (classes = []) => {
  let timeTables = {};
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the website and wait for it to load
    await page.goto("https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx");
    await page.waitForSelector('[name="ddlClasses"]');

    if (classes.length === 0) {
      classes = await classesListScrapper();
    }
    for (let i = 0; i < classes.length; i++) {
      console.log(classes[i]);
      // Change the select element to "BSE 6A" and fire the onchange event
      await page.select('[name="ddlClasses"]', classes[i]);
      await page.waitForSelector("#gvTimeTable1");

      // Extract the table HTML content and output it to the console
      const tableHtml = await page.$eval(
          "#gvTimeTable1",
          (table) => table.outerHTML
      );

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
        data.push(rowData);
      });
      timeTables[classes[i]] = data;
      await addClassTimetable(transformSchedule(data), classes[i]);
    }
    fs.writeFileSync("./Output/Timetable.json", JSON.stringify(timeTables));
    const teacherSchedule = extractTeacherSchedule(timeTables);
    console.log(Object.keys(timeTables).length + " classes added");
    for (const teacher in teacherSchedule) {
      console.log(teacher)
      await addTeacherSchedule(teacherSchedule[teacher], teacher);
    }
    console.log(Object.keys(teacherSchedule).length + " teachers added");
    await browser.close();
  } catch (error) {
    fs.writeFileSync("./Output/Timetable.json", JSON.stringify(timeTables));
    throw new Error(error.message);
  }
};

module.exports = {scrapClassTimetable};

