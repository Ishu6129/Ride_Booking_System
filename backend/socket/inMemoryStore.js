// backend/socket/inMemoryStore.js

/**
 * In‑memory store for quick real-time operations.
 * (MongoDB will store the final records)
 */

module.exports = {
  drivers: {},     // { driverId: { socketId, lat, lng, online } }
  riders: {},      // { riderId: { socketId } }
  activeRides: {}, // { rideId: { riderId, driverId, status } }

  // ---------------- DRIVER FUNCTIONS ----------------
  addOrUpdateDriver(driverId, socketId, lat, lng, online) {
    this.drivers[driverId] = {
      driverId,
      socketId,
      lat,
      lng,
      online
    };
  },

  updateDriverLocation(driverId, lat, lng) {
    if (!this.drivers[driverId]) return;
    this.drivers[driverId].lat = lat;
    this.drivers[driverId].lng = lng;
  },

  setDriverOnline(driverId, online) {
    if (!this.drivers[driverId]) return;
    this.drivers[driverId].online = online;
  },

  getOnlineDrivers() {
    return Object.values(this.drivers).filter((d) => d.online);
  },

  getDriverSocket(driverId) {
    return this.drivers[driverId]?.socketId || null;
  },

  // ---------------- RIDER FUNCTIONS ----------------
  addRider(riderId, socketId) {
    this.riders[riderId] = { riderId, socketId };
  },

  getRiderSocket(riderId) {
    return this.riders[riderId]?.socketId || null;
  },

  // ---------------- RIDE FUNCTIONS ----------------
  createRide(rideId, riderId, driverId) {
    this.activeRides[rideId] = {
      riderId,
      driverId,
      status: "requested"
    };
  },

  setRideStatus(rideId, status) {
    if (this.activeRides[rideId]) {
      this.activeRides[rideId].status = status;
    }
  },

  getActiveRideByDriver(driverId) {
    return Object.entries(this.activeRides).find(
      ([_, ride]) => ride.driverId === driverId
    );
  }
};
