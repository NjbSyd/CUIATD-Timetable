const puppeteer = require("puppeteer");

/*
 extracts the list of classes from the website
 @returns an Array: ["BSE 6A", "BSE 6B", ...]
 */
const CourseSemesterSectionScrapper = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Navigate to the website and wait for it to load
    await page.goto('https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx');
    await page.waitForSelector('[name="ddlClasses"]');
    const classes = await page.$$eval('[name="ddlClasses"] option', options => options.map(option => option.value));
    await browser.close();
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = CourseSemesterSectionScrapper;