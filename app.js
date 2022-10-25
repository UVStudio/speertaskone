const express = require('express');
const app = express();
const user = require('./routes/user.route');
const mongodb = require('./mongodb/mongoose');

mongodb.connect();

app.use(express.json());

app.use('/user', user);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.json('hello');
});

module.exports = app;
