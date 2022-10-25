const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/userAuth');

const {
  createTweet,
  getTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
} = require('../controllers/tweet.controller');

router.post('/', protect, createTweet);
router.get('/', getTweets);
router.get('/:tweetId', getTweetById);
router.put('/:tweetId', protect, updateTweet);
router.delete('/:tweetId', protect, deleteTweet);

module.exports = router;
