// driver-frontend/src/services/driverSocket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL, { autoConnect: false });

// Connect as driver and announce online
export function connectDriver(driverId, initialLat = null, initialLng = null) {
  if (!socket.connected) {
    socket.auth = { driverId };
    socket.connect();
  }
  socket.emit("driver_online", { driverId, lat: initialLat, lng: initialLng });
}

// Disconnect driver
export function disconnectDriver(driverId) {
  try {
    socket.emit("driver_offline", { driverId });
  } catch (e) {}
  socket.disconnect();
}

// accept ride
export function acceptRide(rideId, driverId) {
  socket.emit("ride_accept", { rideId, driverId });
}

// send location update
export function sendLocation(driverId, lat, lng) {
  socket.emit("driver_location", { driverId, lat, lng });
}

// trip lifecycle
export function startTrip(rideId) {
  socket.emit("trip_started", { rideId });
}
export function completeTrip(rideId) {
  socket.emit("trip_completed", { rideId });
}

// event listeners: server -> driver
export function onRideOffer(cb) {
  socket.on("ride_offer", cb);
}
export function offRideOffer() {
  socket.off("ride_offer");
}

export default socket;
