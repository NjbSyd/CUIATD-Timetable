// const puppeteer = require("puppeteer");
// const CourseSemesterSectionScrapper = require("../Puppeteer/ClassesListScrapper");
// const { extractInfo } = require("../Functions/DataManipulation");
// const cheerio = require("cheerio");
//
// /*
//  * extracts the timetable of the given classes
//  * @param classes an array of classes to extract timetable of. If not provided, it will extract timetable of all classes
//  * @returns JSON - { [ { { },...},...],...}
//  * */
// const scrapClassTimetable = async (classes = []) => {
//   let timeTables = {};
//   try {
//     const browser = await puppeteer.launch({
//       headless: "new",
//     });
//     const page = await browser.newPage();
//
//     // Navigate to the website and wait for it to load
//     await page.goto("https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx");
//     await page.waitForSelector('[name="ddlClasses"]');
//
//     if (classes.length === 0) {
//       classes = await CourseSemesterSectionScrapper();
//     }
//     for (let classNo = 0; classNo < classes.length; classNo++) {
//       console.log(classes[classNo]);
//       // Change the select element to "BSE 6A" and fire the onchange event
//       await page.select('[name="ddlClasses"]', classes[classNo]);
//       await page.waitForSelector("#gvTimeTable1");
//
//       // Extract the table HTML content and use Cheerio for parsing
//       const tableHtml = await page.$eval(
//         "#gvTimeTable1",
//         (table) => table.outerHTML
//       );
//       const $ = cheerio.load(tableHtml);
//
//       const header = $("th");
//       const time = [];
//       header.each((i, col) => {
//         if (i > 0) time.push($(col).text());
//       });
//
//       const rows = $("tr");
//       const data = [];
//       rows.each((_, row) => {
//         const cols = $(row).find("td");
//         const rowData = {};
//         let k = 0;
//         cols.each((i, col) => {
//           if (i === 0) {
//             rowData["Day"] = $(col).text();
//           } else if ($(col).html().split("<br>").length > 1) {
//             const info = extractInfo($(col).html().toString());
//             if ($(col).attr("colspan") > 1) {
//               rowData[time[k]] = info;
//               rowData[time[k + 1]] = info;
//               k += 2;
//             } else {
//               rowData[time[k]] = info;
//               k++;
//             }
//           } else {
//             rowData[time[k]] = null;
//             k++;
//           }
//         });
//         if (Object.keys(rowData).length > 0 && rowData["Day"] !== "Saturday") {
//           data.push(rowData);
//         }
//       });
//       timeTables[classes[classNo]] = data;
//     }
//     await browser.close();
//     return timeTables;
//   } catch (error) {
//     console.log(error);
//     return timeTables;
//   }
// };
//
// module.exports = { scrapClassTimetable };
