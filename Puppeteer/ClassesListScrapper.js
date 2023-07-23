const axios = require('axios');
const cheerio = require('cheerio');

/*
 extracts the list of classes from the website
 @returns an Array: ["BSE 6A", "BSE 6B", ...]
 */
const CourseSemesterSectionScrapper = async () => {
  const url = 'https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx';

  try {
    const response = await axios.get(url);
    console.log(response.status)
    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return extractClassesFromHTML(response.data);
  } catch (error) {
    throw new Error(error.message);
  }
};

const extractClassesFromHTML = (html) => {
  const classes = [];
  const $ = cheerio.load(html);
  const options = $('[name="ddlClasses"] option');

  options.each((_, element) => {
    const classValue = $(element).attr('value');
    classes.push(classValue);
  });
  console.log(classes)
  return classes;
};

module.exports = CourseSemesterSectionScrapper;
