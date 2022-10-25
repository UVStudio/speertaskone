const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/userAuth');

const {
  createUser,
  loginUser,
  getCurrentUser,
  logOut,
} = require('../controllers/user.controller');

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', protect, getCurrentUser);
router.post('/logout', logOut);

module.exports = router;
