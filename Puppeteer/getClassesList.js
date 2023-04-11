const puppeteer = require("puppeteer");

const getClassesList = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the website and wait for it to load
  await page.goto('https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx');
  await page.waitForSelector('[name="ddlClasses"]');
  const classes = await page.$$eval('[name="ddlClasses"] option', options => options.map(option => option.value));
  await browser.close();
  return classes;
}

module.exports = getClassesList;