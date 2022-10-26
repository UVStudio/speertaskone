const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getCurrentUser,
  logOut,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/userAuth');

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', protect, getCurrentUser);
router.post('/logout', logOut);

module.exports = router;
