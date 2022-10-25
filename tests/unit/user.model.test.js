const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: `);
});

const User = require('../../models/User');

describe('User Password Authentication', () => {
  it('should generate the same hash given the same password text and salt', () => {
    try {
      let salt = User.generateSalt();
      let hash = User.generateHash('888888', salt);
      expect(hash).toEqual(User.generateHash('888888', salt));
    } catch (err) {
      throw new Error(err);
    }
  });
  it('should NOT generate the same hash given the same password text but a different salt', () => {
    try {
      let hash = User.generateHash('888888', '5');
      expect(hash).not.toEqual(User.generateHash('888888', '7'));
    } catch (err) {
      throw new Error(err);
    }
  });
  it('should save a user with hashed_password and salt attributes', async () => {
    try {
      let result = await new User({
        name: 'sam',
        password: '888888',
      }).save();
      expect(Object.keys(result._doc)).toEqual(
        expect.arrayContaining(['salt', 'hashed_password'])
      );
    } catch (err) {
      throw new Error(err);
    }
  });
  it('should throw an error if the password value is empty', async () => {
    try {
      await new User({
        name: 'sam',
        password: '',
      }).save();
    } catch (err) {
      expect(err.errors.password.message).toEqual('Password is required');
    }
  });
  it('should throw an error if password length is less than 6', async () => {
    try {
      await new User({
        name: 'sam',
        password: '123',
      }).save();
    } catch (err) {
      expect(err.errors.password.message).toEqual(
        'Password must be at least 6 characters.'
      );
    }
  });
  it('should throw an error if authentication is given a wrong password', async () => {
    try {
      await new User({
        name: 'sam',
        password: '888888',
      }).save();
      let result = await User.findOne({ name: 'sam' });
      let wrongPassword = '123456';
      let auth = User.authenticate(
        wrongPassword,
        result.hashed_password,
        result.salt
      );
      expect(auth).toEqual(false);
    } catch (err) {
      throw new Error(err);
    }
  });
  it('should authenticate successfully if given correct password', async () => {
    try {
      await new User({
        name: 'sam',
        password: '888888',
      }).save();
      let result = await User.findOne({ name: 'sam' });
      let rightPassword = '888888';
      let auth = User.authenticate(
        rightPassword,
        result.hashed_password,
        result.salt
      );
      expect(auth).toEqual(true);
    } catch (err) {
      throw new Error(err);
    }
  });
});

afterEach(async () => {
  try {
    await User.deleteMany({});
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
});
