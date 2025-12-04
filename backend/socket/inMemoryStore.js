// backend/socket/inMemoryStore.js
/**
 * Structure:
 * drivers: { driverId: { socketId, lat, lng, online } }
 * riders:  { riderId:  { socketId } }
 * activeRides: { rideId: { riderId, driverId, status } }
 */

const drivers = {};
const riders = {};
const activeRides = {};

function addOrUpdateDriver(driverId, socketId, lat = null, lng = null, online = true) {
  drivers[driverId] = Object.assign({}, drivers[driverId] || {}, { socketId, lat, lng, online });
}

function removeDriver(driverId) {
  delete drivers[driverId];
}

function updateDriverLocation(driverId, lat, lng) {
  if (!drivers[driverId]) return;
  drivers[driverId].lat = lat;
  drivers[driverId].lng = lng;
}

function setDriverOnline(driverId, online) {
  if (!drivers[driverId]) drivers[driverId] = { socketId: null, lat: null, lng: null, online };
  drivers[driverId].online = online;
}

function getOnlineDrivers() {
  return Object.entries(drivers)
    .filter(([id, d]) => d.online && d.lat != null && d.lng != null)
    .map(([id, d]) => ({ driverId: id, ...d }));
}

function getDriverSocket(driverId) {
  return drivers[driverId] && drivers[driverId].socketId;
}

function addRider(riderId, socketId) {
  riders[riderId] = { socketId };
}

function getRiderSocket(riderId) {
  return riders[riderId] && riders[riderId].socketId;
}

function createRide(rideId, riderId, driverId) {
  activeRides[rideId] = { riderId, driverId, status: 'requested' };
}

function setRideStatus(rideId, status) {
  if (!activeRides[rideId]) return;
  activeRides[rideId].status = status;
}

function getActiveRideByRider(riderId) {
  return Object.entries(activeRides).find(([rideId, r]) => r.riderId === riderId);
}

function getActiveRideByDriver(driverId) {
  return Object.entries(activeRides).find(([rideId, r]) => r.driverId === driverId);
}

module.exports = {
  addOrUpdateDriver,
  removeDriver,
  updateDriverLocation,
  setDriverOnline,
  getOnlineDrivers,
  getDriverSocket,
  addRider,
  getRiderSocket,
  createRide,
  setRideStatus,
  getActiveRideByRider,
  getActiveRideByDriver,
  drivers,
  riders,
  activeRides
};
