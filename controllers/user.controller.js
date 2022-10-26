const User = require('../models/User');

//desc    CREATE user
//route   POST /user
//access  public
exports.createUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    let user = await User.findOne({ name });

    if (user) throw new Error('User already exists');

    //make sure there are inputs and password has min of 6 digits
    if (!name || !password || password.length < 6)
      throw new Error('Credentials invalid');

    const salt = await User.generateSalt();

    user = await User.create({
      name,
      password,
      salt,
    });

    //add token to authenticate user
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//desc    LOGIN user
//route   POST /user/login
//access  public
exports.loginUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    //make sure inputs are complete
    if (!name || !password)
      throw new Error('Please provide a name and password');

    const user = await User.findOne({ name });

    if (!user) throw new Error('Invalid credentials');

    if (User.authenticate(password, user.hashedPassword, user.salt)) {
      //add token to authenticate user
      sendTokenResponse(user, 200, res);
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

//desc    GET current logged in user
//route   GET /user
//access  private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new Error('No user is logged in at the moment', 400);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//desc    LOGOUT user / clear cookie
//route   POST /user/logout
//access  private
exports.logOut = async (req, res, next) => {
  try {
    //remove token from cookies
    res.cookie('token', 'none', {
      expires: new Date(Date.now()),
    });

    res.status(200).json({
      message: 'You have logged out',
    });
  } catch (error) {
    next(error);
  }
};

/*** HELPER ***/
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  //where we save token to cookie, with options
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token, user, options });
};
