const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const fs = require('fs'); 

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
 
        const titles = await Promise.all(titleElements.map(async (element) => await element.getText()));
        const authors = await Promise.all(authorElements.map(async (element) => await element.getText()));
        const imgs = await Promise.all(imgElements.map(async (element) => await element.getAttribute('src')));
        const descs = await Promise.all(descElements.map(async (element) => await element.getAttribute('innerHTML')));
            
 //Combine arrays into a structured format
        const bestSellers = titles.map((title, index) => ({
        title: title,
        author: authors[index],
        img: imgs[index],
        description: descs[index]
        }));

        //console.log(bestSellers);

        const csvData = bestSellers.map(book => `${book.title},${book.author},${book.img},${book.description}`).join('\n');
        fs.writeFileSync('best_sellers_v1.csv', csvData);
        console.log('Extracted data saved to best_sellers.csv');

    } catch (error) {
        console.error('Error:', error);
    }finally {
        await driver.quit();
    }
};
scrapeBestSellers();

