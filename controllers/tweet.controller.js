const Tweet = require('../models/Tweet');
const User = require('../models/User');

//desc    CREATE tweet
//route   POST /tweet
//access  public
exports.createTweet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = req.user.id;
    if (!user) throw new Error('No user is logged in at the moment');

    const { content } = req.body;
    const timeStamp = Date.now();

    const tweet = await Tweet.create({ user: userId, content, timeStamp });
    res.status(200).json(tweet);
  } catch (error) {
    next(error);
  }
};

//desc    GET all tweets
//route   GET /tweet
//access  public
exports.getTweets = async (req, res, next) => {
  try {
    const allTweets = await Tweet.find({});
    res.status(200).json(allTweets);
  } catch (error) {
    next(error);
  }
};

//desc    GET tweet by ID
//route   GET /tweet/:tweetId
//access  public
exports.getTweetById = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

//desc    UPDATE tweet by ID
//route   PUT /tweet/:tweetId
//access  private
exports.updateTweet = async (req, res, next) => {
  try {
    //make sure logged in user is same as user of the tweet
    const user = await User.findById(req.user.id);
    const tweet = await Tweet.findById(req.params.tweetId);

    if (user.id !== tweet.user.toString()) {
      throw new Error('You are not authorized to update this tweet!');
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      req.params.tweetId,
      req.body,
      { new: true }
    );
    if (updatedTweet) {
      res.status(200).json(updatedTweet);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

//desc    DELETE tweet by ID
//route   DELETE /tweet/:tweetId
//access  private
exports.deleteTweet = async (req, res, next) => {
  try {
    //make sure logged in user is same as user of the tweet
    const user = await User.findById(req.user.id);
    const tweet = await Tweet.findById(req.params.tweetId);

    if (user.id !== tweet.user.toString())
      throw new Error('You are not authorized to delete this tweet!');

    const deletedTweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    if (deletedTweet) {
      res.status(200).json(deletedTweet);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};
