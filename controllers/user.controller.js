const User = require('../models/User');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { nextTick } = require('process');

//desc    CREATE user
//route   POST /user/
//access  public
exports.createUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    let user = await User.findOne({ name });

    if (user) throw new Error('User already exists');

    const salt = await User.generateSalt();
    const hashed_password = await User.generateHash(password, salt);

    user = await User.create({
      name,
      password: hashed_password,
      salt,
    });

    res.status(201).json(hashed_password);
  } catch (error) {
    next(error);
  }
};
