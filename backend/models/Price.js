const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    enum: ['economy', 'premium', 'xl'],
    required: true,
    unique: true
  },
  baseFare: {
    type: Number,
    required: true,
    default: 40
  },
  perKmCharge: {
    type: Number,
    required: true,
    default: 15
  },
  perMinuteCharge: {
    type: Number,
    required: true,
    default: 2
  },
  minFare: {
    type: Number,
    default: 40
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Price', priceSchema);
