const mongoose = require('mongoose');
const User = require('./User');

const driverSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: true
  },
  licenseExpiry: Date,
  licenseDocument: String,
  vehicleNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['economy', 'premium', 'xl'],
    default: 'economy'
  },
  vehicleRegistration: String,
  insuranceDocument: String,
  averageRating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  currentRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: null
  },
  bankAccount: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  documentVerificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
});

// Geospatial index for location queries
driverSchema.index({ currentLocation: '2dsphere' });

module.exports = User.discriminator('driver', driverSchema);
