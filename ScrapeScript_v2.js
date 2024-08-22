const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const sqlite3 = require('sqlite3').verbose();

const options = new Chrome.Options();
options.addArguments('--headless');

const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

async function scrapeBestSellers() {
    let db = new sqlite3.Database('books.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    try {
        await driver.get('https://www.nytimes.com/books/best-sellers/');

        await driver.wait(until.titleIs('Best Sellers - Books'), 10000);
        console.log(await driver.getTitle());

        const titleElements = await driver.findElements(By.css('.css-i1z3c1'));
        const authorElements = await driver.findElements(By.css('.css-1nxjbfc'));
        const imgElements = await driver.findElements(By.css('.css-35otwa'));
        const descElements = await driver.findElements(By.css('.css-5yxv3r'));         
        const buyElements = await driver.findElements(By.css('li:nth-child(5) > .css-114t425'));
        
        await new Promise((resolve, reject) => {
            db.serialize(async function () {
                db.run("DROP TABLE IF EXISTS books");
                db.run(`CREATE TABLE books (
                    id INTEGER PRIMARY KEY,
                    title TEXT,
                    author TEXT,
                    img TEXT,
                    description TEXT,
                    buy TEXT            
                )`);

                const stmt = db.prepare(`INSERT INTO books (title, author, img, description, buy) VALUES (?, ?, ?, ?, ?)`);
                for (let i = 0; i < titleElements.length; i++) {
                    const title = titleElements[i] ? await titleElements[i].getText() : null;
                    const author = authorElements[i] ? await authorElements[i].getText() : null;
                    const img = imgElements[i] ? await imgElements[i].getAttribute('src') : null;
                    const description = descElements[i] ? await descElements[i].getAttribute('innerHTML') : null;
                    const buy = buyElements[i] ? await buyElements[i].getAttribute('href') : null;

                    stmt.run(title, author, img, description, buy);
                }

                stmt.finalize();
                resolve();
            });
        });
         
         console.log("Data saved to SQLite database.");
         
    } catch (error) {
        console.error('Error:', error);
    }finally {
        await driver.quit();
        db.close();
        
    }
};
scrapeBestSellers();

