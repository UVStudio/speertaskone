const express = require('express');
const app = express();
const mongodb = require('./mongodb/mongoose');
const cookieParser = require('cookie-parser');

const user = require('./routes/user.route');
const tweet = require('./routes/tweet.route');

//connect DB
mongodb.connect();

app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/user', user);
app.use('/tweet', tweet);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.json('hello');
});

module.exports = app;
