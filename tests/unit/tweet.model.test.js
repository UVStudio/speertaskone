const mongoose = require('mongoose');
const {
  createTweet,
  getTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
} = require('../../controllers/tweet.controller');
const httpMocks = require('node-mocks-http');
const dotenv = require('dotenv');

const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const newTweet = require('../../mock-data/newTweet.json');
const newUser = require('../../mock-data/newUser.json');
const allTweets = require('../../mock-data/allTweets.json');

dotenv.config({ path: '.env' });

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: `);
});

Tweet.create = jest.fn();
Tweet.find = jest.fn();
Tweet.findById = jest.fn();
Tweet.findByIdAndUpdate = jest.fn();
User.findById = jest.fn();

let req, res, next;

const tweetId = '63581e1608bae3fb28c75399';

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('createTweet', () => {
  beforeEach(() => {
    req.user = newUser;
    user = newUser;
  });
  it('should have a createTweet function', () => {
    expect(typeof createTweet).toBe('function');
  });
  it('should call User.findById & Tweet.create', async () => {
    User.findById.mockReturnValue(newUser);
    Tweet.create.mockReturnValue(newTweet);
    await createTweet(req, res, next);
    expect(User.findById).toBeCalledWith(newUser.id);
    expect(Tweet.create).toBeCalled();
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    Tweet.create.mockReturnValue(newTweet);
    await createTweet(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTweet);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'Invalid Inputs' };
    const rejectedPromise = Promise.reject(errorMessage);
    Tweet.create.mockReturnValue(rejectedPromise);
    await createTweet(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
describe('getTweets', () => {
  it('should have a getTweets function', () => {
    expect(typeof getTweets).toBe('function');
  });
  it('should call Tweet.find', async () => {
    await getTweets(req, res, next);
    expect(Tweet.find).toBeCalled();
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    Tweet.find.mockReturnValue(allTweets);
    await getTweets(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allTweets);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'No tweets found' };
    const rejectedPromise = Promise.reject(errorMessage);
    Tweet.find.mockReturnValue(rejectedPromise);
    await getTweets(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('getTweetById', () => {
  beforeEach(() => {});
  it('should have a getTweetById function', () => {
    expect(typeof getTweetById).toBe('function');
  });
  it('should call Tweet.findById', async () => {
    req.params.tweetId = '6789';
    await getTweetById(req, res, next);
    expect(Tweet.findById).toBeCalledWith('6789');
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return json body in response', async () => {
    Tweet.findById.mockReturnValue(newTweet);
    await getTweetById(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTweet);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'No tweet by that ID found' };
    const rejectedPromise = Promise.reject(errorMessage);
    Tweet.findById.mockReturnValue(rejectedPromise);
    await getTweetById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
describe('deleteTweet', () => {
  beforeEach(() => {
    req.user = newUser;
  });
  it('should have a updateTweet function', () => {
    expect(typeof updateTweet).toBe('function');
  });
  it('should call Tweet.findById and User.findById', async () => {
    req.params.tweetId = tweetId;
    req.body = newTweet;
    await updateTweet(req, res, next);
    expect(User.findById).toBeCalledWith(newUser.id);
    expect(Tweet.findById).toBeCalledWith(tweetId);
  });
  // it('should call findByIdAndUpdate', async () => {
  //   await updateTweet(req, res, next);
  //   expect(Tweet.findByIdAndUpdate).toBeCalled();
  // });
});

// afterEach(async () => {
//   try {
//     await Tweet.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// });
