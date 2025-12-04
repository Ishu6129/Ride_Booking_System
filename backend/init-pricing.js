#!/usr/bin/env node

// Script to initialize pricing data if not already present
require('dotenv').config();
const mongoose = require('mongoose');
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

async function initializePricing() {
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

    // Check existing pricing
    const existingPrices = await Price.countDocuments();
    
    if (existingPrices > 0) {
      console.log(`ℹ️  ${existingPrices} pricing records already exist\n`);
      
      // Display existing pricing
      const prices = await Price.find();
      console.log('📊 Current Pricing Structure:');
      console.log('─'.repeat(50));
      prices.forEach(price => {
        console.log(`\n${price.vehicleType.toUpperCase()}`);
        console.log(`  Base Fare: ₹${price.baseFare}`);
        console.log(`  Per KM: ₹${price.perKmCharge}`);
        console.log(`  Per Minute: ₹${price.perMinuteCharge}`);
        console.log(`  Minimum Fare: ₹${price.minFare}`);
      });
    } else {
      console.log('🗑️  No pricing records found, inserting default prices...');
      
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
    }

    console.log('\n' + '─'.repeat(50));
    console.log('\n✨ Pricing initialization complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing pricing:', error.message);
    process.exit(1);
  }
}

initializePricing();
