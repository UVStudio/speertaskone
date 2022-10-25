const {
  createTweet,
  getTweets,
  getTweetById,
} = require('../../controllers/tweet.controller');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const httpMocks = require('node-mocks-http');
const newTweet = require('../../mock-data/newTweet.json');
const newUser = require('../../mock-data/newUser.json');
const allTweets = require('../../mock-data/allTweets.json');

Tweet.create = jest.fn();
User.findById = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('createTweet', () => {
  beforeEach(() => {});
  it('should have a createTweet function', () => {
    expect(typeof createTweet).toBe('function');
  });
});
