const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create a new SQLite database connection
const db = new sqlite3.Database('books.db', sqlite3.OPEN_READONLY);

// Define a route to fetch all books
app.get('/api/books', (req, res) => {
    // Execute a SQL query to fetch all books from the database
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error('Error fetching books:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Fetched books:', rows);
            res.json(rows);
        }
    });
});


// Define a route to fetch a specific book by ID
// app.get('/api/books/:id', (req, res) => {
//     const bookId = req.params.id;

//     // Execute a SQL query to fetch the book with the specified ID
//     db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
//         if (err) {
//             console.error('Error fetching book:', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//         } else if (!row) {
//             // If the book with the specified ID is not found, return a 404 Not Found error
//             res.status(404).json({ error: 'Book not found' });
//         } else {
//             // Send the fetched book as a JSON response
//             res.json(row);
//         }
//     });
// });

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


module.exports = app;