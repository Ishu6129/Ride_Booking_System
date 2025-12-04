const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickupLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  dropoffLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arriving', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  fare: {
    baseFare: Number,
    distanceFare: Number,
    durationFare: Number,
    totalFare: Number,
    discount: {
      type: Number,
      default: 0
    },
    finalFare: Number
  },
  distance: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'cash', 'card'],
    default: 'wallet'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  riderRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  },
  driverRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  },
  route: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date
  }],
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  arrivedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['rider', 'driver', 'admin'],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
