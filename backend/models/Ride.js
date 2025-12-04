const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    rideId: { type: String, required: true, unique: true },
    riderId: { type: String, required: true },
    driverId: { type: String },
    
    pickup: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },

    drop: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },

    fareEstimate: Number,

    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed"],
      default: "requested"
    },

    startedAt: Date,
    completedAt: Date
  },

  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
