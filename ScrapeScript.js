const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const sqlite3 = require('sqlite3').verbose();

const options = new Chrome.Options();
options.addArguments('--headless');

const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

async function scrapeBestSellers() {
    try {
        await driver.get('https://www.nytimes.com/books/best-sellers/');

        await driver.wait(until.titleIs('Best Sellers - Books'), 10000);
        console.log(await driver.getTitle());

        const titleElements = await driver.findElements(By.css('.css-i1z3c1'));
        console.log("Number of title elements found:", titleElements.length);

        const authorElements = await driver.findElements(By.css('.css-1nxjbfc'));
        console.log("Number of author elements found:", authorElements.length);

        const imgElements = await driver.findElements(By.css('.css-35otwa'));
        console.log("Number of img elements found:", imgElements.length);

        const descElements = await driver.findElements(By.css('.css-5yxv3r'));              
        console.log("Number of description elements found:", descElements.length);         
 
         const db = new sqlite3.Database('books.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

         db.run(`CREATE TABLE IF NOT EXISTS books (
             id INTEGER PRIMARY KEY,
             title TEXT,
             author TEXT,
             img TEXT,
             description TEXT
         )`);
 
         const stmt = db.prepare(`INSERT INTO books (title, author, img, description) VALUES (?, ?, ?, ?)`);
         for (let i = 0; i < titleElements.length; i++) {
             const title = await titleElements[i].getText();
             const author = await authorElements[i].getText();
             const img = await imgElements[i].getAttribute('src');
             const description = await descElements[i].getAttribute('innerHTML'); 
             stmt.run(title, author, img, description);

          const existingRecord = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM books WHERE title = ? AND author = ? AND img = ? AND description = ?`, [title, author, img, description], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

            if (!existingRecord) {
                stmt.run(title, author, img, description);
            } else {
                console.log(`Skipping duplicate record: ${title} - ${author}`);
            }
         }
         stmt.finalize();
 
         console.log("Data saved to SQLite database.");

    } catch (error) {
        console.error('Error:', error);
    }finally {
        await driver.quit();
        
    }
};
scrapeBestSellers();

