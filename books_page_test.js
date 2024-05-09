const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const screenshotsFolder = 'TestImg';
const driver = new Builder().forBrowser('chrome').build();

async function takeScreenshot(filename) {
    try {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.join(screenshotsFolder, filename);
        fs.writeFileSync(filePath, screenshot, 'base64');
        console.log(`Screenshot saved as ${filePath}`);
    } catch (error) {
        console.error('Error while taking screenshot:', error);
    }
}
async function bestSellersTest() {
    let parentWindowHandle;

    try {
        await driver.get('http://127.0.0.1:5500/splashPage.html');
        await driver.wait(until.titleIs('Welcome to Book Recommendations!'), 30000);
        console.log(await driver.getTitle());
        await takeScreenshot('intro.png');

        await driver.findElement(By.className('start-button')).click();
        await driver.wait(until.titleIs('Book Recommendation'), 30000);
        console.log(await driver.getTitle());        
        await driver.findElement(By.className('btn')).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.className('book-img'))), 30000);
        await takeScreenshot('after_navigation.png');

        let bookTitle =await driver.findElement(By.className('book-title'));
        let authorName = await driver.findElement(By.className('book-author'));
        console.log(`Current Title and Author: ${await bookTitle.getText()}, ${await authorName.getText()}`);
        
        await driver.findElement(By.className('btn')).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.className('book-img'))), 30000);
        await takeScreenshot('after_click.png');               

        bookTitle =await driver.findElement(By.className('book-title'));
        authorName = await driver.findElement(By.className('book-author'));
        console.log(`Post click Title and Author: ${await bookTitle.getText()}, ${await authorName.getText()}`); 
        
        parentWindowHandle = await driver.getWindowHandle();

        await driver.findElement(By.className('author-button')).click();
        await switchToNewTab(driver);
        await takeScreenshot('authorPage.png');

        await driver.switchTo().window(parentWindowHandle);
        await driver.wait(until.titleIs('Book Recommendation'), 30000);

        await driver.findElement(By.className('details-button')).click();
        await switchToNewTab(driver);
        await takeScreenshot('detailsPage.png');       

    } catch (error) {
        console.log('Error:', error);
        await takeScreenshot('error.png');
    }finally {
        await driver.quit();
    }
}
async function switchToNewTab(driver) {
    try {
      // Get all window handles (including parent window)
      const allWindowHandles = await driver.getAllWindowHandles();

      // Switch to the newly opened tab (window)
      const newTabHandle = allWindowHandles[allWindowHandles.length - 1];
      await driver.switchTo().window(newTabHandle);

        console.log('Switched to new tab');
    } catch (error) {
        console.error('Error while switching to new tab:', error);
    }
}

bestSellersTest();