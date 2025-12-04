const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Price = require('../models/Price');

const verifyDriver = async (req, res) => {
  try {
    const { driverId, status } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        isVerified: status === 'verified',
        documentVerificationStatus: status
      },
      { new: true }
    );

    res.json({
      message: `Driver ${status} successfully`,
      driver
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json({
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('-password');
    res.json({
      count: riders.length,
      riders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json({
      count: rides.length,
      rides
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePricing = async (req, res) => {
  try {
    const { vehicleType, baseFare, perKmCharge, perMinuteCharge, minFare } = req.body;

    let pricing = await Price.findOne({ vehicleType });

    if (!pricing) {
      pricing = new Price({
        vehicleType,
        baseFare,
        perKmCharge,
        perMinuteCharge,
        minFare,
        updatedBy: req.userId
      });
    } else {
      pricing.baseFare = baseFare;
      pricing.perKmCharge = perKmCharge;
      pricing.perMinuteCharge = perMinuteCharge;
      pricing.minFare = minFare;
      pricing.updatedAt = new Date();
      pricing.updatedBy = req.userId;
    }

    await pricing.save();

    res.json({
      message: 'Pricing updated successfully',
      pricing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPricingStructure = async (req, res) => {
  try {
    const pricing = await Price.find();
    res.json({
      count: pricing.length,
      pricing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRideAnalytics = async (req, res) => {
  try {
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });
    
    const totalRevenue = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare.finalFare' } } }
    ]);

    res.json({
      totalRides,
      completedRides,
      cancelledRides,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyDriver,
  getAllDrivers,
  getAllRiders,
  getAllRides,
  updatePricing,
  getPricingStructure,
  getRideAnalytics
};
