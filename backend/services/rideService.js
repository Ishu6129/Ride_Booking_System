const Ride = require("../models/Ride");

async function createRideRecord({ rideId, riderId, driverId, pickup, drop, fareEstimate }) {
  return Ride.create({
    rideId,
    riderId,
    driverId,
    pickup,
    drop,
    fareEstimate,
    status: "requested"
  });
}

async function updateRideStatus(rideId, status) {
  const update = { status };

  if (status === "started") update.startedAt = new Date();
  if (status === "completed") update.completedAt = new Date();

  return Ride.findOneAndUpdate({ rideId }, update, { new: true });
}

module.exports = {
  createRideRecord,
  updateRideStatus
};
