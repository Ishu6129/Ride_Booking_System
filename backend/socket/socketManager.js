const store = require("./inMemoryStore");
const { haversineDistance, log } = require("./utils");
const { v4: uuidv4 } = require("uuid");

const {
  upsertDriverStatus,
  setDriverOnline
} = require("../services/driverService");

const {
  createRideRecord,
  updateRideStatus
} = require("../services/rideService");

module.exports = function socketManager(io) {
  io.on("connection", (socket) => {
    log("Socket connected:", socket.id);

    // ---------------- DRIVER ONLINE ----------------
    socket.on("driver_online", async ({ driverId, lat, lng }) => {
      log("driver_online:", driverId);

      // In‑memory store update
      store.addOrUpdateDriver(driverId, socket.id, lat, lng, true);
      socket.join(`driver_${driverId}`);

      // DB update
      try {
        await upsertDriverStatus(driverId, lat, lng, true);
      } catch (err) {
        console.error("DB: upsertDriverStatus Error", err.message);
      }
    });

    // ---------------- DRIVER OFFLINE ----------------
    socket.on("driver_offline", async ({ driverId }) => {
      log("driver_offline:", driverId);

      store.setDriverOnline(driverId, false);
      socket.leave(`driver_${driverId}`);

      try {
        await setDriverOnline(driverId, false);
      } catch (err) {
        console.error("DB: setDriverOnline Error", err.message);
      }
    });

    // ---------------- RIDER JOIN ----------------
    socket.on("rider_join", ({ riderId }) => {
      log("rider_join:", riderId);
      store.addRider(riderId, socket.id);
      socket.join(`rider_${riderId}`);
    });

    // ---------------- RIDE REQUEST ----------------
    socket.on("ride_request", async ({ riderId, pickup, drop }) => {
      log("ride_request from:", riderId);

      // Step 1: Find nearest driver
      const onlineDrivers = store.getOnlineDrivers();
      if (onlineDrivers.length === 0) {
        io.to(store.getRiderSocket(riderId)).emit("no_driver_available", {
          message: "No drivers online."
        });
        return;
      }

      let nearest = null;
      let bestDist = 999999;

      onlineDrivers.forEach((d) => {
        const dist = haversineDistance(pickup.lat, pickup.lng, d.lat, d.lng);
        if (dist < bestDist) {
          bestDist = dist;
          nearest = d;
        }
      });

      if (!nearest || bestDist > 8) {
        io.to(store.getRiderSocket(riderId)).emit("no_driver_available", {
          message: "No driver within 8 km"
        });
        return;
      }

      // Step 2: Create ride
      const rideId = uuidv4();
      store.createRide(rideId, riderId, nearest.driverId);

      const fareEstimate = Math.round(bestDist * 10) + 20;

      // Save to DB
      try {
        await createRideRecord({
          rideId,
          riderId,
          driverId: nearest.driverId,
          pickup,
          drop,
          fareEstimate
        });
      } catch (err) {
        console.error("DB: createRideRecord Error", err.message);
      }

      // Step 3: Notify driver
      io.to(nearest.socketId).emit("ride_offer", {
        rideId,
        riderId,
        pickup,
        drop,
        distanceKmEstimate: bestDist,
        fareEstimate
      });

      // Notify rider that driver is being contacted
      io.to(store.getRiderSocket(riderId)).emit("ride_searching", {
        rideId,
        message: "Finding driver..."
      });
    });

    // ---------------- RIDE ACCEPT ----------------
    socket.on("ride_accept", async ({ rideId, driverId }) => {
      log("ride_accept:", rideId, driverId);

      store.setRideStatus(rideId, "accepted");

      const ride = store.activeRides[rideId];
      if (!ride) return;

      const riderSocket = store.getRiderSocket(ride.riderId);

      if (riderSocket) {
        io.to(riderSocket).emit("driver_found", {
          rideId,
          driverId,
          driverSocketId: socket.id
        });
      }

      // DB update
      try {
        await updateRideStatus(rideId, "accepted");
      } catch (err) {
        console.error("DB: updateRideStatus Error", err.message);
      }
    });

    // ---------------- DRIVER LOCATION UPDATE ----------------
    socket.on("driver_location", ({ driverId, lat, lng }) => {
      store.updateDriverLocation(driverId, lat, lng);

      const rideEntry = store.getActiveRideByDriver(driverId);
      if (!rideEntry) return;

      const [rideId, ride] = rideEntry;

      const riderSocket = store.getRiderSocket(ride.riderId);
      if (!riderSocket) return;

      io.to(riderSocket).emit("driver_location_update", {
        rideId,
        driverId,
        lat,
        lng
      });
    });

    // ---------------- TRIP STARTED ----------------
    socket.on("trip_started", async ({ rideId }) => {
      log("trip_started:", rideId);

      store.setRideStatus(rideId, "started");

      const ride = store.activeRides[rideId];
      if (!ride) return;

      const riderSocket = store.getRiderSocket(ride.riderId);

      // Notify rider
      if (riderSocket) {
        io.to(riderSocket).emit("trip_started", { rideId });
      }

      // DB update
      try {
        await updateRideStatus(rideId, "started");
      } catch (err) {
        console.error("DB: updateRideStatus(started) Error", err.message);
      }
    });

    // ---------------- TRIP COMPLETED ----------------
    socket.on("trip_completed", async ({ rideId }) => {
      log("trip_completed:", rideId);

      store.setRideStatus(rideId, "completed");

      const ride = store.activeRides[rideId];
      if (!ride) return;

      const riderSocket = store.getRiderSocket(ride.riderId);
      const driverSocket = store.getDriverSocket(ride.driverId);

      if (riderSocket) io.to(riderSocket).emit("trip_completed", { rideId });
      if (driverSocket) io.to(driverSocket).emit("trip_completed", { rideId });

      // DB update
      try {
        await updateRideStatus(rideId, "completed");
      } catch (err) {
        console.error("DB: updateRideStatus(completed) Error", err.message);
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", () => {
      log("Socket disconnected:", socket.id);

      // Clean drivers
      Object.entries(store.drivers).forEach(([id, d]) => {
        if (d.socketId === socket.id) {
          store.setDriverOnline(id, false);
        }
      });

      // Clean riders
      Object.entries(store.riders).forEach(([id, r]) => {
        if (r.socketId === socket.id) {
          delete store.riders[id];
        }
      });
    });
  });
};
