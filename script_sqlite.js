const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');


async function createDb(data) {
    let db = new sqlite3.Database('books.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    await new Promise((resolve, reject) => {
        db.serialize(async function () {
            // Drop the table if it exists and create a new one
            db.run("DROP TABLE IF EXISTS books", (err) => {
                if (err) {
                    console.error('Error dropping table:', err);
                    reject(err);
                    return;
                }
            });

            db.run(`CREATE TABLE books (
                id INTEGER PRIMARY KEY,
                title TEXT,
                author TEXT,
                img TEXT,
                description TEXT,
                buy TEXT
            )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    reject(err);
                    return;
                }
            });

            const stmt = db.prepare(`INSERT INTO books (title, author, img, description, buy) VALUES (?, ?, ?, ?, ?)`);
            data.forEach(async (item) => {
                const { title, author, img, description, buy } = item;
                stmt.run(title, author, img, description, buy, (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        reject(err);
                    }
                });
            });

            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing statement:', err);
                    reject(err);
                }
                resolve();
            });
        });
    });

    console.log("Data saved to SQLite database.");
    db.close();
}

async function saveScrapingResults(data, results = 'results') {
    // Ensure the results directory exists
    if (!fs.existsSync(results)) {
        fs.mkdirSync(results);
    }    

    // Create a timestamp for the file names
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format: YYYY-MM-DDTHH-MM-SS

    // Define file paths with timestamp
    const jsonFilePath = path.join(results, `results-${timestamp}.json`);
    const csvFilePath = path.join(results, `results-${timestamp}.csv`);

    try {
        // Save data to JSON file
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Data saved to ${jsonFilePath}`);

        // Convert data to CSV format
        const csv = parse(data);

        // Save data to CSV file
        fs.writeFileSync(csvFilePath, csv, 'utf-8');
        console.log(`Data saved to ${csvFilePath}`);
    } catch (error) {
        console.error('Error saving scraping results:', error);
    }
}

module.exports = {createDb, saveScrapingResults};