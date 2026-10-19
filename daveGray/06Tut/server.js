const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3500;

app.get('/', (req, res) => {
  //res.sendFile('./viewa/index.html', {root: __dirname});
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));