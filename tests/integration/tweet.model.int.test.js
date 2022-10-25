const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const User = require('../../models/User');
const Tweet = require('../../models/Tweet');
const newUser = require('../../mock-data/newUser.json');
const newTweet = require('../../mock-data/newTweet.json');

const endpointUrl = '/tweet/';

const testData = { user: '345', content: 'test content', timeStamp: '23280' };
let firstTweet, newTweetId;

describe(endpointUrl, () => {
  it('GET' + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[0].user).toBeDefined();
    expect(response.body[0].content).toBeDefined();
    expect(response.body[0].timeStamp).toBeDefined();
    firstTweet = response.body[0];
  });
  it('GET by Id ' + endpointUrl + ':todoId', async () => {
    const response = await request(app).get(endpointUrl + firstTweet._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(firstTweet._id);
    expect(response.body.user).toBe(firstTweet.user);
    expect(response.body.content).toBe(firstTweet.content);
    expect(response.body.timeStamp).toBe(firstTweet.timeStamp);
  });
  it('GET by Id doesnt exist ' + endpointUrl + ':todoId', async () => {
    const response = await request(app).get(
      endpointUrl + '6356ee9da4b0364bae336211'
    );
    expect(response.statusCode).toBe(404);
  });
});

// afterEach(async () => {
//   try {
//     await Tweet.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// });
