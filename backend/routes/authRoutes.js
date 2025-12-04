const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  registerRider,
  registerDriver,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register/rider', registerRider);
router.post('/register/driver', registerDriver);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
