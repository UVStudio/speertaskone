const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: [true, 'Please say something!'],
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model('Tweet', TweetSchema);
module.exports = Tweet;
