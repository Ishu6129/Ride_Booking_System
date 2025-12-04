// backend/socket/socketManager.js
const store = require('./inMemoryStore');
const { haversineDistance, log } = require('./utils');
const { v4: uuidv4 } = require('uuid'); // add uuid to package.json if not present

/**
 * Event names used:
 * - driver_online (client -> server) : { driverId, lat, lng }
 * - driver_offline (client -> server) : { driverId }
 * - driver_location (client -> server) : { driverId, lat, lng }
 * - rider_join (client -> server) : { riderId }
 * - ride_request (client -> server) : { riderId, pickup: {lat,lng}, drop: {lat,lng} }
 * - ride_offer (server -> driver) : { rideId, riderId, pickup, drop, distanceKmEstimate, fareEstimate }
 * - ride_accept (client -> server) : { rideId, driverId }
 * - driver_found (server -> rider) : { rideId, driverId, driverSocket } // simplified
 * - driver_location_update (server -> rider) : { driverId, lat, lng }
 * - trip_started / trip_completed events...
 */

module.exports = function socketManager(io) {
  io.on('connection', (socket) => {
    log('socket connected', socket.id);

    // driver comes online (or registers)
    socket.on('driver_online', (payload) => {
      const { driverId, lat, lng } = payload;
      log('driver_online', driverId, lat, lng);
      store.addOrUpdateDriver(driverId, socket.id, lat, lng, true);
      // optional: join driver-specific room
      socket.join(`driver_${driverId}`);
      // notify admin or others if needed
    });

    socket.on('driver_offline', (payload) => {
      const { driverId } = payload;
      log('driver_offline', driverId);
      store.setDriverOnline(driverId, false);
      socket.leave(`driver_${driverId}`);
    });

    socket.on('driver_location', (payload) => {
      const { driverId, lat, lng } = payload;
      // update store
      store.updateDriverLocation(driverId, lat, lng);
      // forward to rider if assigned
      const rideEntry = store.getActiveRideByDriver(driverId);
      if (rideEntry) {
        const [rideId, ride] = rideEntry;
        const riderSocketId = store.getRiderSocket(ride.riderId);
        if (riderSocketId) {
          io.to(riderSocketId).emit('driver_location_update', { driverId, lat, lng, rideId });
        }
      }
    });

    // rider joins (register their socket)
    socket.on('rider_join', (payload) => {
      const { riderId } = payload;
      log('rider_join', riderId);
      store.addRider(riderId, socket.id);
      socket.join(`rider_${riderId}`);
    });

    // rider requests a ride — server tries to find nearest driver and emits ride_offer to that driver
    socket.on('ride_request', (payload) => {
      const { riderId, pickup, drop } = payload;
      log('ride_request', riderId, pickup, drop);

      // pick nearest online driver within 5km
      const onlineDrivers = store.getOnlineDrivers();
      let nearest = null;
      let bestDist = Infinity;
      onlineDrivers.forEach(d => {
        const dist = haversineDistance(pickup.lat, pickup.lng, d.lat, d.lng);
        if (dist < bestDist) {
          bestDist = dist;
          nearest = d;
        }
      });

      if (!nearest || bestDist > 5) {
        // no driver found
        const riderSock = store.getRiderSocket(riderId);
        if (riderSock) io.to(riderSock).emit('no_driver_available', { message: 'No driver within 5 km' });
        return;
      }

      // create ride id and save mapping
      const rideId = uuidv4();
      store.createRide(rideId, riderId, nearest.driverId);

      // compute a very simple fare estimate (e.g., base 20 + 10 per km)
      const fareEstimate = Math.max(20, Math.round(bestDist * 10) + 20);

      // send ride_offer to driver
      const driverSocketId = nearest.socketId;
      io.to(driverSocketId).emit('ride_offer', {
        rideId, riderId, pickup, drop,
        distanceKmEstimate: bestDist,
        fareEstimate
      });

      // notify rider that driver was requested (searching)
      const riderSock = store.getRiderSocket(riderId);
      if (riderSock) io.to(riderSock).emit('ride_searching', { rideId, message: 'Searching for driver...' });
    });

    // driver accepts ride
    socket.on('ride_accept', (payload) => {
      const { rideId, driverId } = payload;
      log('ride_accept', rideId, driverId);
      // mark active ride
      store.setRideStatus(rideId, 'accepted');

      // notify rider with driver info
      const ride = store.activeRides[rideId];
      if (ride) {
        const riderSocketId = store.getRiderSocket(ride.riderId);
        const driverSocketId = store.getDriverSocket(driverId);
        if (riderSocketId) {
          io.to(riderSocketId).emit('driver_found', {
            rideId,
            driverId,
            driverSocketId
          });
        }
      }
    });

    // driver starts trip
    socket.on('trip_started', (payload) => {
      const { rideId } = payload;
      log('trip_started', rideId);
      store.setRideStatus(rideId, 'started');
      const ride = store.activeRides[rideId];
      if (ride) {
        const riderSocketId = store.getRiderSocket(ride.riderId);
        if (riderSocketId) io.to(riderSocketId).emit('trip_started', { rideId });
      }
    });

    // driver completes trip
    socket.on('trip_completed', (payload) => {
      const { rideId } = payload;
      log('trip_completed', rideId);
      store.setRideStatus(rideId, 'completed');
      const ride = store.activeRides[rideId];
      if (ride) {
        const riderSocketId = store.getRiderSocket(ride.riderId);
        const driverSocketId = store.getDriverSocket(ride.driverId);
        if (riderSocketId) io.to(riderSocketId).emit('trip_completed', { rideId });
        if (driverSocketId) io.to(driverSocketId).emit('trip_completed', { rideId });
      }
    });

    // handle disconnects (cleanup)
    socket.on('disconnect', (reason) => {
      log('disconnect', socket.id, reason);
      // We might want to remove driver/rider by socketId
      // simple cleanup: find driver with this socket id and mark offline
      Object.entries(store.drivers).forEach(([id, d]) => {
        if (d.socketId === socket.id) {
          log('marking driver offline due to disconnect', id);
          store.setDriverOnline(id, false);
        }
      });

      // remove riders' socket mapping
      Object.entries(store.riders).forEach(([id, r]) => {
        if (r.socketId === socket.id) {
          log('rider disconnected', id);
          delete store.riders[id];
        }
      });
    });
  });
};
