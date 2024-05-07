const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;
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

// app.get('/api/books/:id', (req, res) => {
//     const bookId = req.params.id;

//     db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
//         if (err) {
//             console.error('Error fetching book:', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//         } else if (!row) {
//             res.status(404).json({ error: 'Book not found' });
//         } else {
//             res.json(row);
//         }
//     });
// });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


module.exports = app;