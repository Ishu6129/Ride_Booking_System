const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Rider = require('../models/Rider');
const Price = require('../models/Price');
const { calculateFare } = require('../utils/location');
const { getRouteAndDistance } = require('../utils/googleMaps');

const estimateFare = async (req, res) => {
  try {
    const { pickupLat, pickupLon, dropoffLat, dropoffLon, vehicleType = 'economy' } = req.body;

    console.log('📍 Estimating fare:', { pickupLat, pickupLon, dropoffLat, dropoffLon, vehicleType });

    // Validate required fields
    if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
      return res.status(400).json({ 
        message: 'Missing required fields: pickupLat, pickupLon, dropoffLat, dropoffLon' 
      });
    }

    // Validate coordinates are numbers
    if (isNaN(pickupLat) || isNaN(pickupLon) || isNaN(dropoffLat) || isNaN(dropoffLon)) {
      return res.status(400).json({ 
        message: 'Coordinates must be valid numbers' 
      });
    }

    // Validate vehicle type
    if (!['economy', 'premium', 'xl'].includes(vehicleType)) {
      return res.status(400).json({ 
        message: 'Invalid vehicle type. Use economy, premium, or xl' 
      });
    }

    // Get route and distance
    const routeData = await getRouteAndDistance(pickupLat, pickupLon, dropoffLat, dropoffLon);
    console.log('📏 Route calculated:', { distance: routeData.distance, duration: routeData.duration });

    // Get pricing for vehicle type
    const pricing = await Price.findOne({ vehicleType });
    if (!pricing) {
      return res.status(404).json({ message: `Pricing not found for vehicle type: ${vehicleType}. Please initialize pricing in database.` });
    }

    console.log('💰 Pricing found:', pricing);

    // Calculate fare
    const fare = calculateFare(
      routeData.distance,
      routeData.duration,
      pricing.baseFare,
      pricing.perKmCharge,
      pricing.perMinuteCharge,
      pricing.minFare
    );

    console.log('✅ Fare calculated:', fare);

    res.json({
      distance: routeData.distance,
      duration: routeData.duration,
      fare,
      polyline: routeData.polyline
    });
  } catch (error) {
    console.error('❌ Estimate fare error:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const requestRide = async (req, res) => {
  try {
    console.log('📝 Request ride input:', req.body);
    console.log('👤 Authenticated user:', req.userId);

    const { pickupLat, pickupLon, dropoffLat, dropoffLon, pickupAddress, dropoffAddress, vehicleType = 'economy' } = req.body;

    // Validate required fields
    if (!pickupLat || !pickupLon || !dropoffLat || !dropoffLon) {
      console.error('❌ Missing coordinates:', { pickupLat, pickupLon, dropoffLat, dropoffLon });
      return res.status(400).json({ 
        message: 'Missing required fields: pickupLat, pickupLon, dropoffLat, dropoffLon' 
      });
    }

    if (!req.userId) {
      console.error('❌ User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get route and distance
    console.log('🔄 Calculating route...');
    const routeData = await getRouteAndDistance(pickupLat, pickupLon, dropoffLat, dropoffLon);
    console.log('✅ Route data:', routeData);

    // Get pricing
    console.log('🔄 Getting pricing for:', vehicleType);
    const pricing = await Price.findOne({ vehicleType });
    if (!pricing) {
      console.error('❌ Pricing not found for:', vehicleType);
      return res.status(404).json({ message: 'Pricing not found for vehicle type' });
    }
    console.log('✅ Pricing:', pricing);

    // Calculate fare
    const fareData = calculateFare(
      routeData.distance,
      routeData.duration,
      pricing.baseFare,
      pricing.perKmCharge,
      pricing.perMinuteCharge,
      pricing.minFare
    );
    console.log('💰 Fare calculated:', fareData);

    // Create ride
    const ride = new Ride({
      riderId: req.userId,
      pickupLocation: {
        address: pickupAddress || 'Current Location',
        latitude: pickupLat,
        longitude: pickupLon
      },
      dropoffLocation: {
        address: dropoffAddress || 'Destination',
        latitude: dropoffLat,
        longitude: dropoffLon
      },
      distance: routeData.distance,
      duration: routeData.duration,
      fare: {
        baseFare: fareData.baseFare,
        distanceFare: fareData.distanceFare,
        durationFare: fareData.durationFare,
        totalFare: fareData.totalFare,
        discount: 0,
        finalFare: fareData.totalFare
      },
      status: 'requested'
    });

    console.log('💾 Saving ride:', ride);
    await ride.save();
    console.log('✅ Ride saved:', ride._id);

    res.status(201).json({
      message: 'Ride requested successfully',
      ride: {
        _id: ride._id,
        status: ride.status,
        pickup: ride.pickupLocation,
        dropoff: ride.dropoffLocation,
        distance: ride.distance,
        duration: ride.duration,
        fare: ride.fare
      }
    });
  } catch (error) {
    console.error('❌ Request ride error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [{ riderId: req.userId }, { driverId: req.userId }]
    }).sort({ createdAt: -1 }).limit(50);

    res.json({
      count: rides.length,
      rides
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { reason } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel completed or already cancelled ride' });
    }

    ride.status = 'cancelled';
    ride.cancellationReason = reason;
    ride.cancelledAt = new Date();
    ride.cancelledBy = ride.riderId.equals(req.userId) ? 'rider' : 'driver';

    await ride.save();

    // Clear driver's current ride if needed
    if (ride.driverId) {
      await Driver.findByIdAndUpdate(ride.driverId, { currentRideId: null });
    }

    res.json({
      message: 'Ride cancelled successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rateRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating, review } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed rides' });
    }

    const isRider = ride.riderId.equals(req.userId);
    const isDriver = ride.driverId && ride.driverId.equals(req.userId);

    if (!isRider && !isDriver) {
      return res.status(403).json({ message: 'Not authorized to rate this ride' });
    }

    if (isRider) {
      ride.driverRating = { rating, review };
    } else {
      ride.riderRating = { rating, review };
    }

    await ride.save();

    res.json({
      message: 'Ride rated successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  estimateFare,
  requestRide,
  getRideHistory,
  getRideDetails,
  cancelRide,
  rateRide
};
