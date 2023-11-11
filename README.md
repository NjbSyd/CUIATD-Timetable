# CUI ATD Companion Backend

## Overview

CUI ATD Companion Backend is a Node.js-based application responsible for supporting the functionality of the CUI Unofficial Timetable App. This backend component handles data retrieval, processing, storage, and the crucial task of web scraping to ensure a seamless experience for users navigating their timetables.

## Technologies Used

- [Node.js](https://nodejs.org/en/docs): The backbone of the backend, enabling server-side execution for efficient data handling.

- [Express](https://expressjs.com/): Express is employed as the web application framework to streamline routing, middleware development, and facilitate data scraping.

- [MongoDB](https://docs.mongodb.com/): MongoDB serves as the database management system for storing and retrieving both scraped and non-scraped timetable data.

- [Mongoose](https://mongoosejs.com/): Mongoose is used as an elegant MongoDB object modeling tool, providing a straightforward interface for interacting with the database.

- [Playwright](https://playwright.dev/docs/intro): Playwright, a powerful headless browser automation library, is utilized for web scraping tasks, such as interacting with web pages and extracting data.

- [Cheerio](https://cheerio.js.org/docs/intro): Cheerio, a fast and flexible HTML content parsing and manipulation library, facilitates easy extraction of data from scraped pages.

## How It Works

1. **Endpoint Handling**: The backend manages various endpoints to handle requests from the frontend of the CUI ATD Companion app.

2. **Data Retrieval and Scraping**: It interacts with the database to retrieve timetable data requested by the frontend. Additionally, it uses Playwright to scrape data from the "CUOnline" system.

3. **Data Processing**: Upon retrieval, the data is processed as needed to ensure its compatibility with the frontend application.

4. **Data Storage**: The backend is responsible for storing both scraped and non-scraped data in the MongoDB database.

## Getting Started

To set up the CUI ATD Companion Backend locally, follow these steps:

1. Clone this repository to your local machine:

    ```
    git clone https://github.com/NjbSyd/CUI-ATD-Companion-Scrapper.git
    ```

2. Navigate to the project directory:

    ```
    cd <directory-name>
    ```

3. Install the required dependencies and setup playwright:

    ```
    npm run setup
    ```

4. Start the backend server:

    ```
    node index.js
    ```
