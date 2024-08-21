const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const {createDb, saveScrapingResults} = require('./script_sqlite.js');
const sqlite3 = require('sqlite3').verbose();

// Configure Chrome options
const options = new Chrome.Options();
options.addArguments('--headless');

// Initialize WebDriver
const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

// Scrape the best sellers page
async function scrapeBestSellers() {
    let db = new sqlite3.Database('books.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    try {
        await driver.get('https://www.nytimes.com/books/best-sellers/');

        await driver.wait(until.titleIs('Best Sellers - Books'), 10000);
        console.log(await driver.getTitle());

        // Find elements
        const titleElements = await driver.findElements(By.css('.css-i1z3c1'));
        const authorElements = await driver.findElements(By.css('.css-1nxjbfc'));
        const imgElements = await driver.findElements(By.css('.css-35otwa'));
        const descElements = await driver.findElements(By.css('.css-5yxv3r'));         
        const buyElements = await driver.findElements(By.css('li:nth-child(5) > .css-114t425'));
        
        // Extract data from the elements
        const data = [];
        for (let i = 0; i < titleElements.length; i++) {
            const title = titleElements[i] ? await titleElements[i].getText() : null;
            const author = authorElements[i] ? await authorElements[i].getText() : null;
            const img = imgElements[i] ? await imgElements[i].getAttribute('src') : null;
            const description = descElements[i] ? await descElements[i].getAttribute('innerHTML') : null;
            const buy = buyElements[i] ? await buyElements[i].getAttribute('href') : null;

            data.push({ title, author, img, description, buy });        }

        // Save data to database and files
        await createDb(data);
        await saveScrapingResults(data);
         
    }catch (error) {
        console.error('Error:', error);
    }finally {
        await driver.quit();               
    }
};
scrapeBestSellers();



