# Error Resolution Guide

## Issues Fixed ✅

### 1. **404 Error - Failed to load resource**
**Problem:** Backend server is not running or API endpoint is inaccessible.

**Solution:**
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Backend
cd backend
npm run dev
# Should see: "Server running on port 5000"

# Terminal 3 - Start Frontend
cd frontend
npm run dev
# Should see: "Local: http://localhost:5173"
```

**Check:** Open http://localhost:5000/health in browser - should see `{"status":"Server is running"}`

---

### 2. **Google Maps API Key Error - InvalidKeyMapError**
**Problem:** API key was corrupted (`YAIzaSyA...` instead of `AIzaSyA...`)

**Fixed:** Updated both `.env` files with correct key format

**Status:** ✅ Corrected in:
- `backend/.env` - Now has correct API key
- `frontend/.env` - Created with matching API key

---

### 3. **React Router Future Flag Warnings**
**Problem:** React Router v6 warnings about future flags not set

**Fixed:** Added future flags to BrowserRouter:
```jsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

**Status:** ✅ Updated in `frontend/src/App.jsx`

---

### 4. **Google Maps Marker Deprecation Warning**
**Problem:** Using deprecated `google.maps.Marker` API

**Note:** This is a non-blocking warning. The old Marker API still works but is deprecated.

**Workaround (Optional):** Can be updated to AdvancedMarkerElement in future versions.

---

## Environment Variables Setup

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride_booking_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
GOOGLE_MAPS_API_KEY=AIzaSyA-sBccmZShlzZOvMkDHgps2uYc1cDUpwA
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyA-sBccmZShlzZOvMkDHgps2uYc1cDUpwA
```

---

## Startup Checklist

### Prerequisites
- [ ] MongoDB is installed and running (`mongod`)
- [ ] Node.js v16+ installed
- [ ] npm dependencies installed (`npm install` in both folders)

### Startup Steps

**Step 1: MongoDB**
```bash
mongod
# Should see: "waiting for connections on port 27017"
```

**Step 2: Backend Server**
```bash
cd backend
npm run dev
# Should see: "Server running on port 5000"
# Should see: "MongoDB connected"
```

**Step 3: Frontend Dev Server**
```bash
cd frontend
npm run dev
# Should see: "Local: http://localhost:5173"
```

**Step 4: Verify Connectivity**
- Browser: http://localhost:5173 (loads Ride Booking App)
- Console: No 404 errors
- Maps: Should display with Google Maps

---

## Testing Workflow

### 1. Create Rider Account
1. Go to http://localhost:5173
2. Click "Register" (or go to /rider/register)
3. Fill: Name, Email, Phone, Password
4. Click Register → Auto-login

### 2. Create Driver Account
1. Open new browser tab: http://localhost:5173/driver/login
2. Click "Register" (or go to /driver/register)
3. Fill: Name, Email, Phone, License#, Vehicle#, Vehicle Type
4. Click Register → Auto-login

### 3. Test Ride Booking
**As Rider:**
1. You should see a map centered on your location
2. Click map to set pickup location
3. Click map again to set dropoff location
4. Click "Estimate Fare" button
5. Click "Request Ride"

**As Driver (in another browser tab):**
1. Click "Go Online" button
2. Driver becomes visible to riders
3. When rider requests ride, you'll see ride offer
4. Click "Accept Ride"

---

## Troubleshooting Common Issues

### Issue: "Cannot GET /api/..."
**Solution:** Backend is not running. Start it with `npm run dev` in backend folder.

### Issue: "Google Maps not showing"
**Solution:** API key might be invalid. Verify in:
- Network tab (DevTools → Network)
- Console (DevTools → Console)
- Check `frontend/.env` has VITE_GOOGLE_MAPS_API_KEY

### Issue: "Cannot connect to MongoDB"
**Solution:** 
```bash
# Check if mongod is running
# On Windows, start MongoDB separately or use MongoDB Atlas

# If using local MongoDB:
mongod --dbpath "C:/path/to/mongodb/data"
```

### Issue: "Module not found" errors
**Solution:** 
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### Issue: Port already in use
```bash
# Backend port 5000:
# Windows: netstat -ano | findstr :5000
# Then kill process: taskkill /PID <PID> /F

# Frontend port 5173:
# Change in frontend/vite.config.js or let Vite use next available port
```

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register/rider` - Register as rider
- `POST /api/auth/register/driver` - Register as driver
- `POST /api/auth/login` - Login (both roles)
- `GET /api/auth/profile` - Get current user

### Driver Endpoints
- `PUT /api/driver/availability` - Toggle online/offline
- `POST /api/driver/location` - Update location
- `POST /api/driver/nearby` - Get nearby rides (for riders)
- `GET /api/driver/profile` - Get driver profile

### Ride Endpoints
- `POST /api/rides/estimate-fare` - Calculate fare
- `POST /api/rides/request` - Request a ride
- `GET /api/rides/history` - Get ride history
- `GET /api/rides/:rideId` - Get ride details
- `PUT /api/rides/:rideId/cancel` - Cancel ride
- `POST /api/rides/:rideId/rate` - Rate ride

### Admin Endpoints
- `POST /api/admin/verify-driver` - Verify driver
- `GET /api/admin/drivers` - Get all drivers
- `GET /api/admin/riders` - Get all riders
- `GET /api/admin/rides` - Get all rides
- `POST /api/admin/pricing` - Update pricing
- `GET /api/admin/pricing/structure` - Get pricing

---

## WebSocket Events (Real-time)

### From Rider/Driver to Backend
- `ride:request` - Rider requests a ride
- `ride:accept` - Driver accepts ride
- `driver:online` - Driver goes online
- `driver:location:update` - Driver updates location
- `ride:start` - Driver starts trip
- `ride:complete` - Driver completes trip
- `ride:cancel` - Ride cancelled
- `payment:completed` - Payment processed

### From Backend to Rider/Driver
- `ride:request:confirmed` - Ride request acknowledged
- `ride:accepted` - Driver accepted your ride
- `driver:location:update` - Real-time driver location
- `ride:started` - Trip started
- `ride:completed` - Trip completed
- `ride:cancelled` - Ride cancelled

---

## Performance Tips

1. **Use production build for testing:**
   ```bash
   npm run build  # frontend
   npm start      # backend (if available)
   ```

2. **Monitor backend logs** for database queries and errors

3. **Use browser DevTools** to check:
   - Network tab: API response times
   - Console: JavaScript errors
   - Application tab: Local storage (tokens)

---

## Getting Help

1. Check browser console for errors (F12)
2. Check backend terminal for server errors
3. Verify all environment variables are set
4. Check MongoDB is running and accessible
5. Review this guide for specific error messages

---

**Last Updated:** December 4, 2025
**Version:** 1.0
