const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

const setupSocket = (io) => {
  const activeRides = new Map();
  const driverSockets = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Driver goes online
    socket.on('driver:online', async (data) => {
      const { userId, latitude, longitude } = data;
      driverSockets.set(userId, socket.id);

      await Driver.findByIdAndUpdate(userId, {
        isOnline: true,
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      });

      socket.emit('driver:online:confirmed', { status: 'online' });
      console.log(`Driver ${userId} is now online`);
    });

    // Driver updates location
    socket.on('driver:location:update', async (data) => {
      const { userId, latitude, longitude, rideId } = data;

      await Driver.findByIdAndUpdate(userId, {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      });

      // Broadcast location to rider if ride is active
      if (rideId) {
        const ride = await Ride.findById(rideId);
        if (ride) {
          io.to(`ride:${rideId}`).emit('driver:location:update', {
            latitude,
            longitude,
            timestamp: new Date()
          });
        }
      }
    });

    // Rider requests ride
    socket.on('ride:request', async (data) => {
      const { rideId, riderId, pickupLat, pickupLon, dropoffLat, dropoffLon } = data;
      
      // Store active ride
      activeRides.set(rideId, {
        riderId,
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon,
        status: 'requested',
        requestedAt: new Date()
      });

      // Join rider to ride room
      socket.join(`ride:${rideId}`);
      socket.emit('ride:request:confirmed', { status: 'searching for driver' });
      
      console.log(`Ride ${rideId} requested by rider ${riderId}`);
    });

    // Driver accepts ride
    socket.on('ride:accept', async (data) => {
      const { rideId, driverId, latitude, longitude } = data;

      const ride = await Ride.findByIdAndUpdate(rideId, {
        driverId,
        status: 'accepted',
        acceptedAt: new Date()
      }, { new: true });

      await Driver.findByIdAndUpdate(driverId, {
        currentRideId: rideId
      });

      if (activeRides.has(rideId)) {
        activeRides.get(rideId).status = 'accepted';
        activeRides.get(rideId).driverId = driverId;
      }

      // Notify rider of acceptance
      io.to(`ride:${rideId}`).emit('ride:accepted', {
        driverId,
        driverLocation: { latitude, longitude },
        eta: 5 // minutes
      });

      console.log(`Driver ${driverId} accepted ride ${rideId}`);
    });

    // Driver started the trip
    socket.on('ride:start', async (data) => {
      const { rideId, driverId } = data;

      await Ride.findByIdAndUpdate(rideId, {
        status: 'started',
        startedAt: new Date()
      });

      io.to(`ride:${rideId}`).emit('ride:started', {
        status: 'trip started'
      });

      console.log(`Ride ${rideId} started by driver ${driverId}`);
    });

    // Driver completed the trip
    socket.on('ride:complete', async (data) => {
      const { rideId, driverId, finalFare } = data;

      const ride = await Ride.findByIdAndUpdate(rideId, {
        status: 'completed',
        completedAt: new Date(),
        'fare.finalFare': finalFare,
        paymentStatus: 'pending'
      }, { new: true });

      await Driver.findByIdAndUpdate(driverId, {
        currentRideId: null
      });

      activeRides.delete(rideId);

      io.to(`ride:${rideId}`).emit('ride:completed', {
        status: 'trip completed',
        fare: finalFare
      });

      console.log(`Ride ${rideId} completed`);
    });

    // Ride cancelled
    socket.on('ride:cancel', async (data) => {
      const { rideId, userId, reason } = data;

      // Fetch ride first to check riderId
      const existingRide = await Ride.findById(rideId);
      
      const ride = await Ride.findByIdAndUpdate(rideId, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason,
        cancelledBy: existingRide && existingRide.riderId.equals(userId) ? 'rider' : 'driver'
      }, { new: true });

      if (ride && ride.driverId) {
        await Driver.findByIdAndUpdate(ride.driverId, {
          currentRideId: null
        });
      }

      activeRides.delete(rideId);

      io.to(`ride:${rideId}`).emit('ride:cancelled', {
        reason
      });

      console.log(`Ride ${rideId} cancelled`);
    });

    // Payment completed
    socket.on('payment:completed', async (data) => {
      const { rideId, paymentMethod, amount } = data;

      await Ride.findByIdAndUpdate(rideId, {
        paymentStatus: 'completed',
        paymentMethod
      });

      io.to(`ride:${rideId}`).emit('payment:completed', {
        status: 'payment confirmed',
        amount
      });

      console.log(`Payment completed for ride ${rideId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Find and remove driver from map
      for (let [userId, socketId] of driverSockets.entries()) {
        if (socketId === socket.id) {
          driverSockets.delete(userId);
          Driver.findByIdAndUpdate(userId, { isOnline: false });
          console.log(`Driver ${userId} disconnected`);
          break;
        }
      }

      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
