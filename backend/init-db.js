#!/usr/bin/env node

// Script to initialize MongoDB with default pricing data
// Usage: node init-db.js

const mongoose = require('mongoose');
require('dotenv').config();

const Price = require('./models/Price');

const PRICES = [
  {
    vehicleType: 'economy',
    baseFare: 40,
    perKmCharge: 15,
    perMinuteCharge: 2,
    minFare: 40
  },
  {
    vehicleType: 'premium',
    baseFare: 60,
    perKmCharge: 20,
    perMinuteCharge: 3,
    minFare: 60
  },
  {
    vehicleType: 'xl',
    baseFare: 80,
    perKmCharge: 25,
    perMinuteCharge: 4,
    minFare: 80
  }
];

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ride_booking_system',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    console.log('✅ Connected to MongoDB\n');

    // Clear existing prices
    console.log('🗑️  Clearing existing prices...');
    await Price.deleteMany({});
    console.log('✅ Cleared existing prices\n');

    // Insert default prices
    console.log('📝 Inserting default pricing...');
    const insertedPrices = await Price.insertMany(PRICES);
    console.log(`✅ Inserted ${insertedPrices.length} pricing records\n`);

    // Display inserted data
    console.log('📊 Pricing Structure:');
    console.log('─'.repeat(50));
    insertedPrices.forEach(price => {
      console.log(`\n${price.vehicleType.toUpperCase()}`);
      console.log(`  Base Fare: ₹${price.baseFare}`);
      console.log(`  Per KM: ₹${price.perKmCharge}`);
      console.log(`  Per Minute: ₹${price.perMinuteCharge}`);
      console.log(`  Minimum Fare: ₹${price.minFare}`);
    });

    console.log('\n' + '─'.repeat(50));
    console.log('\n✨ Database initialization complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
