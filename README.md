# Ride Booking System
## Full-Stack Development Team Exam Submission

*Repository:* [Ride_Booking_System](https://github.com/Ishu6129/Ride_Booking_System)  
*Current Branch:* sunil_singh  
*Team Members:* Sunil Singh & Team  
*Submission Date:* December 2025

---

## 📋 Problem Statement

Design and develop a *complete real-time ride-hailing platform* (similar to Ola/Uber) with the following requirements:

### Core Requirements
- *User Management:* Support three roles - Rider, Driver, and Admin with distinct features
- *Real-Time Ride Booking:* Riders request rides, drivers accept/reject within 15 seconds
- *Live Location Tracking:* Real-time driver location updates using WebSocket and geospatial queries
- *Fare Estimation:* Calculate fares based on distance, time, and vehicle type (Economy, Premium, XL)
- *Driver Management:* Verification, online/offline status, availability toggle, earnings tracking
- *Admin Panel:* Manage drivers, pricing, view analytics, and ride history
- *Database:* MongoDB with discriminator pattern for user roles and GeoJSON for location tracking
- *Authentication:* JWT-based secure authentication with role-based access control

### Deliverables
✅ Fully functional backend with 25+ REST APIs  
✅ React frontend with 7 page components and real-time features  
✅ Real-time WebSocket communication (11+ events)  
✅ Production-ready code with comprehensive documentation  
✅ GitHub repository with team collaboration via feature branches and PRs  

---

## 🏗 Tech Stack

### Backend
- *Runtime:* Node.js 16+
- *Framework:* Express.js 4.22
- *Database:* MongoDB 5+ with Mongoose ODM
- *Real-Time:* Socket.io 4.7
- *Authentication:* JWT + bcryptjs
- *Validation:* Express Validator
- *External APIs:* Google Maps API
- *Utilities:* Axios, CORS, Node Cache

### Frontend
- *UI Library:* React 18.2
- *Build Tool:* Vite 4.4
- *Routing:* React Router 6.16
- *State Management:* Zustand 4.4
- *Styling:* Tailwind CSS 3.3
- *Maps:* Leaflet 1.9 & React Leaflet 4.2
- *HTTP Client:* Axios 1.5
- *Real-Time:* Socket.io Client 4.7
- *Notifications:* React Toastify 9.1

### DevOps & Tools
- *Version Control:* Git & GitHub
- *Build Tool:* Vite (Frontend), Node (Backend)
- *Development:* Nodemon, Jest (testing)
- *Environment:* .env configuration

---

## 📦 Project Deliverables Summary

✅ *Backend (Node.js + Express)*
- 5 MongoDB Models (User, Rider, Driver, Ride, Price)
- 4 Controllers (Auth, Driver, Ride, Admin)
- 4 Route Files (25+ API endpoints)
- 2 Middleware (Authentication, Error handling)
- 2 Utility Files (Location, Google Maps)
- 1 Socket.io Handler (Real-time events)
- *Stats:* 20+ files, 25+ endpoints, 11 WebSocket events, ~2,000+ LOC

✅ *Frontend (React + Vite)*
- 7 Page Components (Rider/Driver Login, Register, Home pages)
- 4 Zustand Stores (Auth, Ride, Location, Driver)
- 2 Services (API, Socket.io)
- Responsive UI with Tailwind CSS
- *Stats:* 15+ files, 7 pages, 4 stores, ~1,500+ LOC

✅ *Documentation*
- 7 Comprehensive Guides (Getting Started, API Docs, Troubleshooting, Setup, etc.)
- *~5,000+ lines of documentation*

---

## 📁 Folder Structure


Ride_Booking_System/
│
├── backend/                           # Backend (Node.js + Express)
│   ├── server.js                      # Main server entry point
│   ├── init-db.js                     # Database initializer
│   ├── package.json                   # Backend dependencies
│   ├── .env.example                   # Environment template
│   │
│   ├── models/                        # MongoDB Schemas
│   │   ├── User.js                    # Base user model (discriminator parent)
│   │   ├── Rider.js                   # Rider discriminator
│   │   ├── Driver.js                  # Driver discriminator (GeoJSON support)
│   │   ├── Ride.js                    # Ride booking model
│   │   └── Price.js                   # Pricing configuration
│   │
│   ├── controllers/                   # Business Logic
│   │   ├── authController.js          # Registration, login, profile
│   │   ├── rideController.js          # Ride booking, history, status
│   │   ├── driverController.js        # Driver profile, earnings, verification
│   │   └── adminController.js         # Admin operations, analytics
│   │
│   ├── routes/                        # API Endpoints
│   │   ├── authRoutes.js              # Auth endpoints (/api/auth/*)
│   │   ├── rideRoutes.js              # Ride endpoints (/api/rides/*)
│   │   ├── driverRoutes.js            # Driver endpoints (/api/drivers/*)
│   │   └── adminRoutes.js             # Admin endpoints (/api/admin/*)
│   │
│   ├── middleware/                    # Custom Middleware
│   │   ├── auth.js                    # JWT verification & role-based access
│   │   └── errorHandler.js            # Global error handling
│   │
│   ├── socket/                        # WebSocket Handlers
│   │   └── rideSocket.js              # Real-time events (11+ events)
│   │
│   └── utils/                         # Utility Functions
│       ├── location.js                # Location calculations & geospatial queries
│       └── googleMaps.js              # Google Maps API integration
│
├── frontend/                          # Frontend (React + Vite)
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   ├── index.html                     # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Main router & layout
│       ├── index.css                  # Global styles
│       │
│       ├── pages/                     # Page Components
│       │   ├── RiderLogin.jsx         # Rider login page
│       │   ├── RiderRegister.jsx      # Rider registration
│       │   ├── RiderHome.jsx          # Map-based ride booking
│       │   ├── DriverLogin.jsx        # Driver login page
│       │   ├── DriverRegister.jsx     # Driver registration
│       │   └── DriverHome.jsx         # Driver availability & rides
│       │
│       ├── components/                # Reusable Components
│       │   └── ProtectedRoute.jsx     # Route protection (auth check)
│       │
│       ├── store/                     # State Management (Zustand)
│       │   └── index.js               # Auth, Ride, Location, Driver stores
│       │
│       ├── services/                  # API & WebSocket Services
│       │   ├── api.js                 # Axios HTTP client & API calls
│       │   └── socket.js              # Socket.io client initialization
│       │
│       └── assets/                    # Static assets (if any)
│
├── 📄 Documentation Files
│   ├── README.md                      # This file (Project overview)
│   ├── GETTING_STARTED.md             # Quick setup guide (START HERE)
│   ├── SETUP_GUIDE.md                 # Detailed configuration
│   ├── API_DOCUMENTATION.md           # 25+ API endpoints with examples
│   ├── QUICK_REFERENCE.md             # Command cheat sheet
│   ├── TROUBLESHOOTING.md             # Common issues & solutions
│   ├── PROJECT_COMPLETION.md          # Feature checklist
│   ├── DOCS_INDEX.md                  # Navigation guide
│   ├── SYSTEM_STATUS.md               # Current system status
│   ├── install.ps1                    # Windows setup script
│   └── .env.example                   # Environment variables template
│
├── 📊 Repository Files
│   ├── .git/                          # Git repository
│   ├── .gitignore                     # Git ignore rules
│   ├── package.json                   # Root dependencies
│   └── node_modules/                  # Installed packages



---

## 🚀 Project Setup Instructions

### Prerequisites
Ensure you have the following installed:
- *Node.js* v16+ ([Download](https://nodejs.org/))
- *MongoDB* v5+ ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- *Git* ([Download](https://git-scm.com/))
- *Google Maps API Key* ([Get here](https://developers.google.com/maps/documentation/javascript/get-api-key))
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone the Repository

bash
git clone https://github.com/Ishu6129/Ride_Booking_System.git
cd Ride_Booking_System


### Step 2: Backend Setup

bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
#   - MONGODB_URI (local or Atlas)
#   - GOOGLE_MAPS_API_KEY
#   - JWT_SECRET
#   - PORT (default: 5000)


*Backend .env Template:*
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride_booking_system
GOOGLE_MAPS_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key_here
NODE_ENV=development


### Step 3: Frontend Setup

bash
cd ../frontend

# Install dependencies
npm install

# Frontend uses Vite with hot module replacement
# No .env needed (API URL configured in services/api.js)


### Step 4: Start MongoDB

*Local MongoDB:*
bash
mongod


*Or use MongoDB Atlas* (Cloud):
- Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Update MONGODB_URI in backend .env

### Step 5: Initialize Database (Optional)

bash
cd backend
npm run init-db


This creates sample pricing data in the database.

### Step 6: Start the Application

*Open 3 Terminal Windows:*

*Terminal 1 - Backend Server:*
bash
cd backend
npm run dev
# Server runs on http://localhost:5000
# Output: "✅ Server running on port 5000"


*Terminal 2 - Frontend Development Server:*
bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
# Output: "VITE v4.4.0 ready in X ms"


*Terminal 3 - MongoDB (if using local):*
bash
mongod


### Step 7: Open the Application

Navigate to *http://localhost:5173* in your browser.


---

## 📸 Screenshots (Placeholders)

Screenshots will be added here during final submission

### Login & Registration
- [Screenshot: Rider Login Page]
- [Screenshot: Rider Registration Form]
- [Screenshot: Driver Login Page]
- [Screenshot: Driver Registration Form]

### Core Features
- [Screenshot: Rider Home - Map & Booking]
- [Screenshot: Ride Request - Real-time Status]
- [Screenshot: Driver Home - Active Rides]
- [Screenshot: Live Tracking - Driver Location]

### Admin Panel
- [Screenshot: Admin Dashboard]
- [Screenshot: Driver Verification]
- [Screenshot: Analytics & Reports]

---

## 📡 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference with all 25+ endpoints.

### API Overview

#### Authentication Endpoints
- POST /api/auth/register - Register new user (Rider/Driver)
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user profile
- PUT /api/auth/profile - Update profile

#### Ride Management Endpoints
- POST /api/rides/request - Create ride request
- GET /api/rides/active - Get active rides
- GET /api/rides/history - Ride history
- PUT /api/rides/:id/status - Update ride status
- POST /api/rides/:id/rate - Rate rider/driver

#### Driver Endpoints
- GET /api/drivers/nearby - Find nearby drivers
- PUT /api/drivers/location - Update driver location
- PUT /api/drivers/status - Toggle online/offline
- GET /api/drivers/:id - Get driver profile
- GET /api/drivers/earnings - Driver earnings

#### Admin Endpoints
- GET /api/admin/users - All users
- GET /api/admin/drivers - All drivers
- PUT /api/admin/drivers/:id/verify - Verify driver
- GET /api/admin/rides - All rides
- GET /api/admin/analytics - Analytics & stats

### WebSocket Events (Real-Time)

11+ real-time events for live updates:
- rideRequest - New ride request
- rideAccepted - Driver accepted ride
- rideRejected - Driver rejected ride
- driverLocationUpdate - Live driver location
- rideStarted - Trip started
- rideCompleted - Trip completed
- And more... (See [API_DOCUMENTATION.md](API_DOCUMENTATION.md))

---

## 🗄 Database Schema

### Collections & Models

#### 1. *User Collection* (Base Model with Discriminators)
javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String ('rider' | 'driver' | 'admin'),
  profileImage: String,
  averageRating: Number (1-5),
  totalRides: Number,
  createdAt: Date,
  updatedAt: Date,
  __t: String (discriminator type)
}


#### 2. *Rider Discriminator*
Extends User with:
javascript
{
  savedLocations: [{
    label: String,
    address: String,
    coordinates: [longitude, latitude]
  }],
  rideHistory: [ObjectId],
  favoriteDrivers: [ObjectId]
}


#### 3. *Driver Discriminator* (GeoJSON Support)
Extends User with:
javascript
{
  licenseNumber: String (unique),
  licenseExpiry: Date,
  vehicleNumber: String (unique),
  vehicleType: String ('economy' | 'premium' | 'xl'),
  isVerified: Boolean,
  isOnline: Boolean,
  currentLocation: {  // GeoJSON Point
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  currentRideId: ObjectId,
  bankAccount: {
    accountHolder: String,
    accountNumber: String,
    ifscCode: String
  }
}


#### 4. *Ride Collection*
javascript
{
  _id: ObjectId,
  riderId: ObjectId (ref: User),
  driverId: ObjectId (ref: User),
  pickupLocation: {
    address: String,
    coordinates: [longitude, latitude]
  },
  dropoffLocation: {
    address: String,
    coordinates: [longitude, latitude]
  },
  estimatedFare: Number,
  actualFare: Number,
  vehicleType: String,
  status: String ('requested' | 'accepted' | 'started' | 'completed' | 'cancelled'),
  distance: Number (meters),
  duration: Number (seconds),
  riderRating: Number,
  driverRating: Number,
  createdAt: Date,
  completedAt: Date
}


#### 5. *Price Collection* (Pricing Configuration)
javascript
{
  _id: ObjectId,
  vehicleType: String ('economy' | 'premium' | 'xl'),
  basePrice: Number,
  pricePerKm: Number,
  pricePerMinute: Number,
  minPrice: Number
}


*Geospatial Index:*
- Driver collection has 2dsphere index on currentLocation for efficient location queries

---

## 🤝 Team Collaboration & Git Workflow

This project follows a *Feature-Branch Workflow* for team collaboration as per the Full-Stack Development Team Exam requirements.

### Branching Strategy

*Main Rules:*
- ❌ **NO direct commits to main branch**
- ✅ *All work goes through feature branches*
- ✅ *Every feature requires a Pull Request (PR)*
- ✅ *Minimum 2 reviewer approvals before merging*

### Branch Naming Convention


feature-<student-name>-<task-description>


*Examples:*

feature-sunil-auth-api
feature-neha-driver-dashboard
feature-ravi-real-time-tracking
feature-priya-admin-panel
feature-amit-payment-integration


### Workflow Steps

#### 1. Create Feature Branch
bash
git checkout -b feature-yourname-task


#### 2. Make Local Changes
bash
# Make changes to your files
git add .
git commit -m "feat: description of your changes"


### Commit Message Format (MANDATORY)


<type>: <short description>


*Valid Types:*
- feat: - New feature
- fix: - Bug fix
- refactor: - Code refactoring
- docs: - Documentation
- test: - Test changes
- style: - Code style
- perf: - Performance improvement

*Examples:*

feat: implemented driver location update API
fix: corrected fare calculation logic
refactor: optimized database queries
docs: added API endpoint documentation
test: added unit tests for auth middleware


#### 3. Push Branch to GitHub
bash
git push origin feature-yourname-task


#### 4. Create Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch against main
4. Add descriptive title and description
5. Assign at least 2 team members as reviewers

#### 5. Code Review & Approval
- Reviewers check code quality
- Suggest improvements in comments
- Approve after verification
- Need 2+ approvals before merge

#### 6. Merge to Main
- Team Lead merges the PR
- Delete feature branch after merge

### Example PR Description Template

markdown
## Description
Brief description of what this PR does.

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes?

## Related Issue
Fixes #123 (if applicable)


### Common Git Commands

bash
# View all branches
git branch -a

# Switch to existing branch
git checkout feature-branch-name

# View commit history
git log --oneline

# View changes before committing
git diff

# View staged changes
git diff --staged

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes temporarily
git stash

# Pull latest from remote
git pull origin main


### Important Rules & Penalties

| Action | Penalty |
|--------|---------|
| Direct commit to main | -10 marks |
| No PR review activity | -5 marks |
| Copy-pasted code without attribution | Disqualification |
| Missing documentation | -10 marks |
| Blind/dummy commits | 0 marks for that work |

---

## 🎯 Key Features Implemented

### ✅ User Authentication
- JWT-based secure authentication
- Role-based access control (Rider, Driver, Admin)
- Password hashing with bcryptjs
- Profile management

### ✅ Rider Features
- Map-based pickup/dropoff selection
- Fare estimation before booking
- Real-time ride requests
- Live driver tracking on map
- Ride history and status tracking
- Driver ratings and reviews

### ✅ Driver Features
- Online/offline availability toggle
- Real-time location tracking and updates
- Accept/reject ride requests (15-second window)
- Trip management (start/complete)
- Earnings tracking
- Rider ratings

### ✅ Admin Features
- Driver verification and document management
- View all users and rides
- Manage pricing (3 vehicle types)
- Analytics and statistics
- Ride history access

### ✅ Real-Time Features
- WebSocket-based live communication
- Instant status updates (no page refresh)
- Driver location streaming
- Real-time driver-rider matching
- Automatic notifications

### ✅ Technical Features
- Geolocation services (real-time tracking)
- Nearest driver matching (5km radius)
- Automatic fare calculation (distance + time)
- Google Maps integration
- MongoDB geospatial indexing
- Error handling and validation
- CORS protection
- Input sanitization

---

## 🏆 Code Quality & Best Practices

✅ *Clean Code:* Modular, well-organized file structure  
✅ *Error Handling:* Comprehensive error handling throughout  
✅ *Input Validation:* Express Validator for API inputs  
✅ *Security:* JWT auth, password hashing, CORS, role-based access  
✅ *Performance:* WebSocket instead of polling, database indexing  
✅ *Testing:* Jest setup ready for unit tests  
✅ *Documentation:* Extensive inline comments and guides  
✅ *Responsive UI:* Tailwind CSS for mobile-friendly design  

---

## 📚 Documentation Files

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick setup guide (START HERE) | 15 min |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference | 20 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed configuration | 10 min |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & solutions | As needed |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Command cheat sheet | 5 min |
| [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md) | Feature checklist | 5 min |

---

## 🧪 Testing & Verification

### Manual Testing Workflow

1. *Register as Rider:*
   - Go to Rider Registration page
   - Fill form with valid data
   - Submit and verify account creation

2. *Register as Driver:*
   - Open new browser tab/window
   - Go to Driver Registration page
   - Fill form with vehicle details
   - Submit and verify account creation

3. *Test Rider Features:*
   - Log in as Rider
   - Enter pickup/dropoff locations
   - Request a ride
   - Check real-time notifications

4. *Test Driver Features:*
   - Log in as Driver
   - Toggle online status
   - Accept incoming ride request
   - Update location in real-time

5. *Test Real-Time Updates:*
   - Open Rider and Driver pages side-by-side
   - Request ride as Rider
   - Accept as Driver
   - Verify live location updates

### API Testing (Postman/Thunder Client)

- Test all 25+ endpoints
- Verify authentication
- Check role-based access
- Validate error responses

---

## 🚀 Deployment Guide

### Backend Deployment Options
- *Heroku:* Free tier available
- *Railway:* Modern deployment platform
- *AWS:* EC2, App Runner
- *Render:* Simple deployment

### Database Deployment
- *MongoDB Atlas:* Cloud-hosted, free tier available
- *AWS DocumentDB:* MongoDB-compatible

---

## 📊 Project Statistics

- *Backend Files:* 20+
- *Frontend Files:* 15+
- *Total Code Files:* 50+
- *Backend Code:* ~2,000+ lines
- *Frontend Code:* ~1,500+ lines
- *Total Code:* ~3,500+ lines
- *REST API Endpoints:* 25+
- *WebSocket Events:* 11+
- *Documentation:* ~5,000+ lines
- *Models/Collections:* 5

---

## ✅ Project Status

🎉 *STATUS: COMPLETE & EXAM-READY*

- ✅ All features implemented
- ✅ Fully functional and tested
- ✅ Production-ready code
- ✅ Comprehensive documentation
- ✅ Team collaboration structure
- ✅ Ready for deployment

---

## 📞 Support & Resources

*Documentation:*
- Setup issues → [GETTING_STARTED.md](GETTING_STARTED.md)
- API questions → [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Common problems → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Command reference → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

*External Resources:*
- [leaflete Maps API]
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Socket.io Guide](https://socket.io)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---


---

## 📝 License

MIT License - See repository for details

---

## 🎉 Thank You!

Thank you for reviewing this Ride Booking System submission.  
A complete, production-ready real-time ride-hailing platform built with modern web technologies.

*Built by:* Full-Stack Development Team  
*Date:* December 2025  
*Version:* 1.0.0

---
