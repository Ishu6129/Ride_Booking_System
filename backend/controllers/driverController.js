const Driver = require('../models/Driver');
const { convertToGeoJSON } = require('../utils/location');

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      {
        currentLocation: convertToGeoJSON(latitude, longitude)
      },
      { new: true }
    );

    res.json({
      message: 'Location updated',
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.body;

    // maxDistance is in meters, MongoDB expects meters for 2dsphere queries
    const drivers = await Driver.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      },
      isOnline: true,
      isVerified: true,
      currentRideId: null
    }).select('_id name phone currentLocation averageRating vehicleType currentRideId');

    res.json({
      message: 'Nearby drivers found',
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { isOnline } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      { isOnline },
      { new: true }
    );

    res.json({
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      isOnline: driver.isOnline
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.userId).select('-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDriverProfile = async (req, res) => {
  try {
    const { licenseExpiry, vehicleRegistration, insuranceDocument, bankAccount } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.userId,
      {
        licenseExpiry,
        vehicleRegistration,
        insuranceDocument,
        bankAccount,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Driver profile updated',
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateLocation,
  getNearbyDrivers,
  toggleAvailability,
  getDriverProfile,
  updateDriverProfile
};
