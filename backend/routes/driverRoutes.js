const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  updateLocation,
  getNearbyDrivers,
  toggleAvailability,
  getDriverProfile,
  updateDriverProfile
} = require('../controllers/driverController');

const router = express.Router();

// All routes require driver authorization
router.use(auth, authorize('driver'));

router.post('/location', updateLocation);
router.post('/nearby', getNearbyDrivers);
router.put('/availability', toggleAvailability);
router.get('/profile', getDriverProfile);
router.put('/profile', updateDriverProfile);

module.exports = router;
