// backend/socket/utils.js

// Simple logger for consistent debugging
function log(...args) {
  console.log("[SOCKET]", ...args);
}

// Haversine distance formula (in KM)
function haversineDistance(lat1, lng1, lat2, lng2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in KM
}

module.exports = {
  haversineDistance,
  log
};
