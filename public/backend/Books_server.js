const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const db = new sqlite3.Database('books.db', sqlite3.OPEN_READONLY);

app.get('/api/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Fetched books:', rows);
            res.json(rows);
        }
    });   
});
app.listen(port,"0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
});


module.exports = app;