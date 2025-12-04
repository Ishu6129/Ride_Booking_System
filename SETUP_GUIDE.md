# Ride Booking System - Setup Guide

## Complete Real-Time Ride-Hailing Platform

### Quick Start

#### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Google Maps API key
npm run dev
```

Server runs on: `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on: `http://localhost:5173`

### Features Implemented

✅ **Rider Features**
- Register/Login
- Map-based pickup/dropoff selection
- Fare estimation before booking
- Request ride (finds nearby drivers)
- Live driver tracking
- Ride history
- Rate drivers

✅ **Driver Features**
- Register/Login with license & vehicle details
- Toggle online/offline availability
- Accept/reject ride requests
- Real-time location tracking
- Complete trips
- View earnings

✅ **Admin Features**
- Verify drivers
- View all users and rides
- Manage pricing (base fare, per-km, per-minute)
- View analytics

✅ **Backend APIs**
- Authentication (JWT)
- Geolocation services
- Ride management
- Driver matching algorithm
- Fare calculation
- Admin controls

✅ **Real-Time Features**
- WebSocket for live updates
- Driver location streaming
- Instant ride status changes
- Payment notifications

### Environment Variables

**Backend `.env.example`**:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride_booking_system
JWT_SECRET=your_secret_here
GOOGLE_MAPS_API_KEY=your_api_key_here
NODE_ENV=development
```

### Project Structure

```
backend/
├── models/        - MongoDB schemas
├── controllers/   - Business logic
├── routes/        - API endpoints
├── middleware/    - Auth middleware
├── utils/         - Helper functions
├── socket/        - WebSocket handlers
└── server.js      - Main server

frontend/
├── src/
│   ├── pages/     - Page components
│   ├── components/- Reusable UI
│   ├── store/     - Zustand state
│   ├── services/  - API & Socket
│   └── App.jsx    - Router
└── index.html
```

### Key Technologies

- **React 18** with Vite for fast development
- **Express.js** for RESTful APIs
- **Socket.io** for real-time communication
- **MongoDB** with geospatial indexing for location queries
- **Google Maps API** for routing and geocoding
- **JWT** for authentication
- **Tailwind CSS** for styling

### API Endpoints Summary

**Auth**: `/api/auth/register/rider`, `/api/auth/login`
**Driver**: `/api/driver/location`, `/api/driver/availability`
**Rides**: `/api/rides/request`, `/api/rides/estimate-fare`, `/api/rides/:id`
**Admin**: `/api/admin/drivers`, `/api/admin/pricing`

### Testing

1. Open two browser windows
2. Register as Rider in one, Driver in the other
3. Rider: Request ride (set locations on map)
4. Driver: Go online and accept request
5. View live tracking as driver moves

### Notes

- MongoDB must be running locally or update MONGODB_URI with Atlas connection
- Google Maps API key required for map features
- WebSocket connects to backend on port 5000
- Frontend proxies API requests to backend

For detailed API documentation, see backend route files.
