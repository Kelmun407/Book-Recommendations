const { Builder, By, Key, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const options = new Chrome.Options();
options.addArguments('--headless');

const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

async function scrapeBestSellers() {
    try {
        await driver.get('https://www.nytimes.com/books/best-sellers/');

        await driver.wait(until.titleIs('Best Selling Books'), 10000);

        const titleElements = await driver.findElements(By.css('[itemprop="name"]'));
        const authorElements = await driver.findElements(By.css('[itemprop="author"] '));
        const imgElements = await driver.findElements(By.css('[role="presentation"]'));
        const descElements = await driver.findElements(By.css('[itemprop="description"]'));
// Extract text from elements and store in arrays
        const titles = await Promise.all(titleElements.map(async (element) => await element.getText()));
        const authors = await Promise.all(authorElements.map(async (element) => await element.getText()));
        const imgs = await Promise.all(imgElements.map(async (element) => await element.getAttribute('src')));
        const descs = await Promise.all(descElements.map(async (element) => await element.getText()));
// Combine arrays into a structured format
    const bestSellers = titles.map((title, index) => ({
    title: title,
    author: authors[index],
    img: imgs[index],
    desc: descs[index]
    }));

    console.log(bestSellers);
    } catch (error) {
        console.error('Error:', error);
    }finally {
        await driver.quit();
    }
};
scrapeBestSellers();
// css-v2kl5d
