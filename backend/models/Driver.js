const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, unique: true },

    lastLocation: {
      lat: Number,
      lng: Number
    },

    online: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
