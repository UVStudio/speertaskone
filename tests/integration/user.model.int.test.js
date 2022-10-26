const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const newUser = require('../../mock-data/newUser.json');

const endpointUrl = '/user';

it('POST' + endpointUrl, async () => {
  const response = await request(app).post(endpointUrl).send(newUser);
  expect(response.statusCode).toBe(200);
  expect(response.body.user.name).toBe(newUser.name);
  expect(response.body.user.hashedPassword).toBeTruthy();
  expect(response.body.user.salt).toBeTruthy();
  expect(response.body.user._id).toBeTruthy();
});
it(
  'should return error 500 on invalid data with POST' + endpointUrl,
  async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ name: 'Just Name' });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Credentials invalid',
    });
  }
);

// Uncomment this 'afterEach' to clean the User collection after each test
// afterEach(async () => {
//   try {
//     await User.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// });
