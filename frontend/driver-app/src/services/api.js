import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL: BASE, timeout: 7000 });

// Optional REST endpoints if backend has them
export async function driverOnline(driverId, lat = null, lng = null) {
  return api.post("/driver/online", { driverId, lat, lng });
}
export async function driverOffline(driverId) {
  return api.post("/driver/offline", { driverId });
}
export async function updateDriverLocation(driverId, lat, lng) {
  return api.post("/driver/location", { driverId, lat, lng });
}
export async function completeRide(rideId) {
  return api.post("/ride/complete", { rideId });
}

export default api;
