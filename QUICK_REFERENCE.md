# Quick Reference Guide

## Project Overview

**Ride Booking System** - A complete real-time ride-hailing application like Ola/Uber.

### Key Components

| Component | Role | Port | Tech |
|-----------|------|------|------|
| Backend | REST API + WebSocket | 5000 | Node.js + Express |
| Frontend | React Web App | 5173 | React + Vite |
| Database | Data Storage | 27017 | MongoDB |
| Maps | Location Services | - | Google Maps API |

---

## Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Check installations
node --version        # v16+ required
npm --version        # 8+ required
mongod --version     # MongoDB should be installed
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run init-db      # Initialize default pricing
npm run dev         # Start server (localhost:5000)
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev         # Start app (localhost:5173)
```

### 4. Open Browser
Navigate to: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride_booking_system
JWT_SECRET=your_secret_key_here_change_in_production
GOOGLE_MAPS_API_KEY=your_api_key_here
NODE_ENV=development
MAX_DRIVER_RADIUS=5000
RIDE_REQUEST_TIMEOUT=15000
BASE_FARE=40
PER_KM_CHARGE=15
PER_MINUTE_CHARGE=2
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## Project Structure

```
backend/
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, error handling
├── utils/           # Helpers
├── socket/          # WebSocket events
├── server.js        # Entry point
└── init-db.js       # Database initialization

frontend/
├── src/
│   ├── pages/       # Full page components
│   ├── components/  # Reusable UI
│   ├── store/       # Zustand state
│   ├── services/    # API & Socket
│   └── App.jsx      # Main router
├── index.html
├── vite.config.js
└── package.json
```

---

## Database Schema

### User (Base)
- name, email, phone, password
- role: 'rider' | 'driver' | 'admin'
- profileImage, isActive

### Rider (extends User)
- preferredPaymentMethod
- walletBalance
- averageRating, totalRides
- emergencyContacts
- savedLocations

### Driver (extends User)
- licenseNumber, vehicleNumber, vehicleType
- isVerified, isOnline
- currentLocation (GeoJSON)
- currentRideId
- bankAccount
- averageRating, totalRides

### Ride
- riderId, driverId
- pickupLocation, dropoffLocation
- status, distance, duration
- fare (baseFare, distanceFare, durationFare, finalFare)
- paymentMethod, paymentStatus
- driverRating, riderRating
- route (array of coordinates)
- timestamps for each status

### Price
- vehicleType: 'economy' | 'premium' | 'xl'
- baseFare, perKmCharge, perMinuteCharge
- minFare

---

## API Quick Reference

### Auth
- `POST /api/auth/register/rider` - Register rider
- `POST /api/auth/register/driver` - Register driver
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Driver
- `POST /api/driver/location` - Update location
- `PUT /api/driver/availability` - Toggle online
- `GET /api/driver/profile` - Get profile

### Rides
- `POST /api/rides/estimate-fare` - Estimate fare
- `POST /api/rides/request` - Request ride
- `GET /api/rides/history` - Get history
- `GET /api/rides/:id` - Get details
- `PUT /api/rides/:id/cancel` - Cancel ride
- `POST /api/rides/:id/rate` - Rate ride

### Admin
- `GET /api/admin/drivers` - All drivers
- `GET /api/admin/riders` - All riders
- `GET /api/admin/rides` - All rides
- `POST /api/admin/pricing` - Update pricing
- `GET /api/admin/pricing/structure` - Get pricing

---

## WebSocket Events

### Main Events
| Event | Direction | Purpose |
|-------|-----------|---------|
| `driver:online` | C→S | Driver goes online |
| `driver:location:update` | C→S | Update driver location |
| `ride:request` | C→S | Rider requests ride |
| `ride:accept` | C→S | Driver accepts ride |
| `ride:start` | C→S | Trip starts |
| `ride:complete` | C→S | Trip ends |
| `ride:cancel` | C→S | Cancel ride |

---

## Ride Fare Calculation

```
Total Fare = Base Fare + (Distance in KM × Per KM Rate) + (Duration in Minutes × Per Minute Rate)

Final Fare = MAX(Total Fare, Minimum Fare)
```

**Example (Economy):**
- Distance: 5 km
- Duration: 15 minutes
- Base Fare: ₹40
- Per KM: ₹15
- Per Minute: ₹2

```
Distance Charge = 5 × 15 = ₹75
Duration Charge = (900 seconds / 60) × 2 = 15 × 2 = ₹30
Total = 40 + 75 + 30 = ₹145
```

---

## Common Commands

```bash
# Backend
cd backend
npm run dev              # Start dev server
npm run start           # Start production
npm run init-db         # Initialize database

# Frontend
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview build

# Database
mongosh                 # Connect to MongoDB
show dbs               # List databases
use ride_booking_system # Select database
db.users.find()        # View users collection
db.rides.find()        # View rides collection

# Utilities
node backend/init-db.js # Initialize default pricing
```

---

## Testing Flow

### As a Rider
1. Go to `http://localhost:5173/rider/register`
2. Register with email/phone
3. On home page, click map to set pickup/dropoff
4. Click "Estimate Fare"
5. Click "Request Ride"
6. Wait for driver to accept (open driver page in another tab)

### As a Driver
1. Go to `http://localhost:5173/driver/register`
2. Register with license/vehicle details
3. On home page, click "Go Online"
4. Accept incoming rides
5. Click "Start Trip"
6. Click "Complete Trip"

---

## Important Endpoints for Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Rider Registration
```bash
curl -X POST http://localhost:5000/api/auth/register/rider \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"9876543210","password":"pass123"}'
```

### Test Fare Estimation
```bash
curl -X POST http://localhost:5000/api/rides/estimate-fare \
  -H "Content-Type: application/json" \
  -d '{"pickupLat":28.7041,"pickupLon":77.1025,"dropoffLat":28.7282,"dropoffLon":77.1093,"vehicleType":"economy"}'
```

---

## Deployment Checklist

- [ ] Update JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for cloud database
- [ ] Enable HTTPS for production
- [ ] Configure CORS properly
- [ ] Test all critical flows
- [ ] Setup error monitoring (Sentry)
- [ ] Enable database backups
- [ ] Configure rate limiting
- [ ] Setup CI/CD pipeline

---

## Performance Tips

1. **Database**: Add indexes to frequently queried fields
2. **APIs**: Implement pagination for list endpoints
3. **Frontend**: Use React.memo for expensive components
4. **WebSocket**: Limit emission frequency for location updates
5. **Maps**: Cache map data, lazy load routes

---

## Security Considerations

✅ Implemented:
- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation

🔒 To Add:
- Rate limiting
- HTTPS enforcement
- CORS configuration
- Helmet.js for headers
- Data encryption
- 2FA support

---

## Support & Resources

- **Documentation**: See API_DOCUMENTATION.md
- **Troubleshooting**: See TROUBLESHOOTING.md
- **Setup Guide**: See SETUP_GUIDE.md
- **Google Maps**: https://developers.google.com/maps
- **MongoDB**: https://docs.mongodb.com
- **Socket.io**: https://socket.io/docs

---

## Version Info

- Node.js: 16+
- React: 18.2
- Express: 4.18
- MongoDB: 5+
- Socket.io: 4.7

---

**Last Updated**: December 2024
