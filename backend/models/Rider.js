const mongoose = require('mongoose');
const User = require('./User');

const riderSchema = new mongoose.Schema({
  preferredPaymentMethod: {
    type: String,
    enum: ['wallet', 'cash', 'card'],
    default: 'wallet'
  },
  walletBalance: {
    type: Number,
    default: 0
  },
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
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  savedLocations: [{
    label: String,
    latitude: Number,
    longitude: Number
  }]
});

module.exports = User.discriminator('rider', riderSchema);
