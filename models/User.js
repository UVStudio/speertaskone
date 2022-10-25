const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, 'Please provide your name'],
    unique: 'Name already exists',
  },
  hashedPassword: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
  },
  salt: String,
});

UserSchema.statics.generateSalt = () => {
  return Math.round(new Date().valueOf() * Math.random()) + '';
  //return '100';
};

UserSchema.statics.generateHash = (password, salt) => {
  try {
    const hmac = crypto.createHmac('sha256', salt);
    return hmac.update(password).digest('hex');
  } catch (err) {
    return err;
  }
};

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.model('User').generateSalt();
    this.hashedPassword = this.model('User').generateHash(password, this.salt);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path('hashedPassword').validate(function () {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, null);

UserSchema.statics.authenticate = function (
  givenPassword,
  hashedPassword,
  salt
) {
  return (
    UserSchema.statics.generateHash(givenPassword, salt) === hashedPassword
  );
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// UserSchema.methods.matchPassword = async function (enteredPassword, user) {

// };

const User = mongoose.model('User', UserSchema);
module.exports = User;
