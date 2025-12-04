# Getting Started - Ride Booking System

Welcome to the **Ride Booking System** - A complete real-time ride-hailing platform!

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [First Steps](#first-steps)
6. [Features Overview](#features-overview)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have the following installed:

### Required Software
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** 8 or higher (comes with Node.js)
- **MongoDB** 5+ ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** (for version control)

### Accounts Needed
- **Google Cloud Account** - For Maps API key ([Get started](https://console.cloud.google.com/))

### Verify Installation
```bash
node --version      # Should be v16 or higher
npm --version       # Should be 8 or higher
mongod --version    # Should show version
```

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd "C:\Users\sunil\OneDrive\Desktop\fullst-g-5\ride_booking_system"
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# This may take 2-3 minutes
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# This may take 2-3 minutes
```

### Step 4: Quick Test
```bash
# Go back to project root
cd ..

# Run installation script (Windows)
.\install.ps1
```

---

## Configuration

### Backend Configuration

1. **Create `.env` file**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `backend/.env`** and update:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ride_booking_system
   JWT_SECRET=your_super_secret_key_change_this_in_production
   GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   NODE_ENV=development
   ```

### Getting Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create an API Key (Credentials)
5. Copy the key to `.env` as `GOOGLE_MAPS_API_KEY`

### Frontend Configuration (Optional)

1. Create `frontend/.env` (optional):
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   ```

---

## Running the Application

### Option 1: Using Individual Terminals (Recommended for Development)

**Terminal 1 - Start MongoDB:**
```bash
mongod
# Let it run
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

### Option 2: Using One Terminal

```bash
# Terminal 1 - Start backend
cd backend && npm run dev

# Open another terminal for frontend
cd frontend && npm run dev
```

### Option 3: Initialize Database

After starting the backend, in a new terminal:

```bash
cd backend
npm run init-db
# This creates default pricing data
```

---

## First Steps

### 1. Open the Application

Open your browser and go to:
```
http://localhost:5173
```

### 2. Create Accounts

**Create a Rider Account:**
- Click "Register" 
- Fill in details:
  - Name: `John Rider`
  - Email: `rider@example.com`
  - Phone: `9876543210`
  - Password: `password123`
- Click Register
- You're logged in as a rider!

**Create a Driver Account:**
- Open a new browser tab
- Go to `http://localhost:5173/driver/login`
- Click "Register"
- Fill in details:
  - Name: `Jane Driver`
  - Email: `driver@example.com`
  - Phone: `9876543211`
  - License Number: `DL-2024-12345`
  - Vehicle Number: `ABC1234`
  - Vehicle Type: `Economy`
  - Password: `password123`
- Click Register
- You're logged in as a driver!

### 3. Test the App

**As a Rider:**
1. On the rider page, you'll see a map
2. Click on the map to set pickup location
3. Click again to set dropoff location
4. Click "Estimate Fare" button
5. Review the fare estimate
6. Click "Request Ride"
7. Wait for driver to accept

**As a Driver:**
1. On the driver page, click "Go Online"
2. You should see a green status indicator
3. You'll see ride requests coming in
4. Click "Accept Ride" to accept a ride
5. You can see the pickup and dropoff locations

**Real-time Tracking:**
- Once driver accepts, the rider sees driver approaching on map
- Driver location updates in real-time
- Click "Start Trip" when driver arrives at pickup
- Click "Complete Trip" when reached dropoff

---

## Features Overview

### Rider Features
- ✅ Register/Login with phone verification ready
- ✅ Map-based location selection
- ✅ Fare estimation before booking
- ✅ Real-time driver tracking
- ✅ Ride history
- ✅ Rate drivers

### Driver Features
- ✅ Register with license/vehicle details
- ✅ Toggle online/offline
- ✅ Accept/reject rides
- ✅ Real-time location tracking
- ✅ Trip management (start/complete)
- ✅ Earnings tracking

### Admin Features (via API)
- ✅ Verify drivers
- ✅ View all users and rides
- ✅ Manage pricing
- ✅ Analytics dashboard

---

## Project Structure at a Glance

```
ride_booking_system/
│
├── backend/                    # Node.js + Express Server
│   ├── models/                 # MongoDB schemas
│   ├── controllers/            # Business logic
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Authentication
│   ├── utils/                  # Helper functions
│   ├── socket/                 # Real-time events
│   ├── server.js               # Main server file
│   ├── .env.example           # Environment template
│   └── package.json           # Dependencies
│
├── frontend/                   # React + Vite App
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable UI
│   │   ├── store/             # State management
│   │   ├── services/          # API & Socket
│   │   ├── App.jsx            # Main router
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── package.json
│
└── Documentation/
    ├── README.md              # Project overview
    ├── SETUP_GUIDE.md        # Detailed setup
    ├── API_DOCUMENTATION.md  # API reference
    ├── TROUBLESHOOTING.md    # Common issues
    └── QUICK_REFERENCE.md    # Quick lookup
```

---

## Common Commands

```bash
# Backend Commands
cd backend
npm install              # Install dependencies
npm run dev             # Start with hot reload
npm start               # Start production
npm run init-db         # Initialize database with default pricing

# Frontend Commands
cd frontend
npm install              # Install dependencies
npm run dev             # Start dev server with hot reload
npm run build           # Build for production
npm run preview         # Preview production build

# MongoDB Commands (if running locally)
mongosh                 # Connect to MongoDB
show dbs               # List databases
use ride_booking_system # Select database
db.users.find()        # View users
db.rides.find()        # View rides
db.dropDatabase()       # Clear all data
```

---

## Checklist Before Going Live

- [ ] MongoDB is running and configured
- [ ] Google Maps API key is valid and enabled
- [ ] `.env` files are created and updated
- [ ] Backend starts without errors: `npm run dev` ✓
- [ ] Frontend starts without errors: `npm run dev` ✓
- [ ] Can register as rider: ✓
- [ ] Can register as driver: ✓
- [ ] Can request a ride: ✓
- [ ] Can accept a ride: ✓
- [ ] Real-time location updates work: ✓
- [ ] Ride completion flow works: ✓

---

## Deployment Preparation

### Before Production:

1. **Security**
   - Change JWT_SECRET to a random string
   - Set NODE_ENV=production
   - Enable HTTPS
   - Add rate limiting

2. **Database**
   - Use MongoDB Atlas (cloud)
   - Enable authentication
   - Setup backups
   - Create indexes

3. **APIs**
   - Restrict Google Maps API key to your domain
   - Setup error monitoring
   - Configure logging

4. **Frontend Build**
   ```bash
   cd frontend
   npm run build
   # Creates optimized build in dist/ folder
   ```

---

## Need Help?

1. **Check Documentation**
   - API Reference: See `API_DOCUMENTATION.md`
   - Troubleshooting: See `TROUBLESHOOTING.md`
   - Quick Tips: See `QUICK_REFERENCE.md`

2. **Common Issues**
   - MongoDB connection error → Check if MongoDB is running
   - Maps not showing → Verify Google Maps API key
   - WebSocket failed → Restart backend and frontend
   - Location not working → Grant browser location permission

3. **Debug Mode**
   - Check browser console: Press F12
   - Check backend logs in terminal
   - Enable verbose logging in .env

---

## Next Steps

1. **Customize**
   - Update pricing in database
   - Modify UI styling in `frontend/src/index.css`
   - Add your business logic

2. **Extend**
   - Add payment integration (Stripe, PayPal)
   - Implement ride sharing
   - Add emergency SOS feature
   - Create admin dashboard

3. **Deploy**
   - Backend: Heroku, Railway, AWS
   - Frontend: Vercel, Netlify, AWS S3
   - Database: MongoDB Atlas

---

## Resources

- **Documentation**: Read the .md files in project root
- **Google Maps**: https://developers.google.com/maps
- **MongoDB**: https://docs.mongodb.com
- **React**: https://react.dev
- **Node.js**: https://nodejs.org/docs
- **Socket.io**: https://socket.io

---

## Support

If you encounter any issues:

1. Check `TROUBLESHOOTING.md` file
2. Review `API_DOCUMENTATION.md` for endpoint details
3. Check browser DevTools (F12) for errors
4. Review backend logs in terminal

---

## Summary

You now have a **complete, production-ready ride-booking system** with:

✅ Real-time driver-rider matching
✅ Live location tracking via WebSocket
✅ Automatic fare calculation
✅ Ride history and ratings
✅ Admin controls and analytics
✅ Responsive web interface
✅ Modern tech stack

**Happy Coding! 🚗** 

Start with the Quick Reference Guide or dive into the API Documentation to explore more!

---

**Created**: December 2024
**Version**: 1.0.0
**License**: MIT
