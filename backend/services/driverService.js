const Driver = require("../models/Driver");

async function upsertDriverStatus(driverId, lat, lng, online) {
  return Driver.findOneAndUpdate(
    { driverId },
    {
      driverId,
      lastLocation: { lat, lng },
      online
    },
    { upsert: true, new: true }
  );
}

async function setDriverOnline(driverId, online) {
  return Driver.findOneAndUpdate(
    { driverId },
    { online },
    { new: true }
  );
}

module.exports = {
  upsertDriverStatus,
  setDriverOnline
};
