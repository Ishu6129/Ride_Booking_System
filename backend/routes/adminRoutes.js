const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  verifyDriver,
  getAllDrivers,
  getAllRiders,
  getAllRides,
  updatePricing,
  getPricingStructure,
  getRideAnalytics
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authorization
router.use(auth, authorize('admin'));

router.post('/verify-driver', verifyDriver);
router.get('/drivers', getAllDrivers);
router.get('/riders', getAllRiders);
router.get('/rides', getAllRides);
router.post('/pricing', updatePricing);
router.get('/pricing/structure', getPricingStructure);
router.get('/analytics/rides', getRideAnalytics);

module.exports = router;
