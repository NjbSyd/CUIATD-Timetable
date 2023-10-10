# Timetable Scrapper

## Overview

Timetable Scrapper is a web scraping tool developed in Node.js that allows you to extract course timetables from the "CUOnline" system of the Abbottabad Campus of the Comsats University Islamabad (CUI). This tool provides a convenient and automated way to collect timetable data for various classes and store it in MongoDB.

## Technologies Used

- [Node.js](https://nodejs.org/en/docs): The core of the application is built on Node.js, which allows us to perform server-side web scraping and automation tasks efficiently.

- [Playwright](https://playwright.dev/docs/intro): Playwright is powerful headless browser automation library used to interact with web pages, navigate through the website, and extract data.

- [Cheerio](https://cheerio.js.org/docs/intro): Cheerio is a fast and flexible library for parsing and manipulating HTML content in the server environment, enabling easy data extraction from the scraped pages.

## How It Works

1. **Class List Retrieval**: Timetable Scrapper starts by retrieving the list of classes available in the "CUOnline" system. This is done using Playwright to navigate to the relevant page and collect the class data.

2. **Timetable Extraction**: Once the class list is obtained, the tool iterates over each class, selects it in the "CUOnline" system, and retrieves the corresponding timetable. The timetable data is extracted using Cheerio to parse 
 the HTML content of the timetable table.

3. **Data Manipulation**: After extracting the timetable data, it is further processed and formatted into a structured JSON representation. The final JSON object contains the timetable for each class, categorized by day and time slots.

4. **Data Storage**: The extracted and processed timetable data is then stored in MongoDB.
