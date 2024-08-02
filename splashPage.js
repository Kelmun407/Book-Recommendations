const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'splashPage.html'));
});

app.get('/Books_index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Books_index.html'));
  });

app.listen(PORT, () => {
  console.log(`Static server running on http://localhost:${PORT}`);
});
