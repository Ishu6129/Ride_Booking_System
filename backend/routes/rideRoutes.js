const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  estimateFare,
  requestRide,
  getRideHistory,
  getRideDetails,
  cancelRide,
  rateRide
} = require('../controllers/rideController');

const router = express.Router();

// Public route
router.post('/estimate-fare', estimateFare);

// Protected routes
router.use(auth);

router.post('/request', requestRide);
router.get('/history', getRideHistory);
router.get('/:rideId', getRideDetails);
router.put('/:rideId/cancel', cancelRide);
router.post('/:rideId/rate', rateRide);

module.exports = router;
