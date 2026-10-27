const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3500;
const errorHandler = require('./middleware/errorHandler');
const { logger } = require('./middleware/logEvents');
const rootRouter = require('./routes/root');
const subRouter = require('./routes/subdir')

app.use(logger);

const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];

const corsOptions = {
  origin: (origin, callback) => {
    if(whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  optionSuccesStatus: 200
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json())

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


app.use('/', rootRouter);
app.use('/subdir', subRouter);
app.use('/employees', require('./routes/api/employees'))

app.all('/{*splat}',(req, res) => {
  res.status(404);

  if(req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send('404 Not Found');
  }
});


app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));