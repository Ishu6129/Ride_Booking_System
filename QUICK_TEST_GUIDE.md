# 🚀 Quick Start Testing Guide

## System Status Check

### ✅ What Should Be Running
```
Frontend: http://localhost:5174
Backend:  http://localhost:5000
Database: MongoDB (connected to backend)
```

### ✅ Quick Verification
```bash
# Check backend running
curl http://localhost:5000/health
# Expected: { "status": "Server is running" }

# Check frontend loaded
# Open: http://localhost:5174 in browser
# Expected: Ride Booking System UI loads
```

---

## Test Flow (Recommended Order)

### Step 1️⃣: Register Rider
**URL**: http://localhost:5174/register/rider

**Form Data**:
```
Name:      John Doe
Email:     rider@test.com
Phone:     9876543210
Password:  password123
```

**Expected Result**:
- ✅ Success toast notification
- ✅ Redirects to /rider/home
- ✅ Leaflet map loads
- ✅ No console errors

**If Failed**:
- Check browser console for errors
- Verify backend is running on 5000
- Check network tab: request should be to `http://localhost:5000/api/auth/register/rider`

---

### Step 2️⃣: Test Map (RiderHome)
**URL**: http://localhost:5174/rider/home

**Expected Result**:
- ✅ Leaflet map loads with OpenStreetMap tiles
- ✅ Current location marked with blue marker
- ✅ Can click map to set pickup location (green marker)
- ✅ Can click map again to set dropoff location (red marker)
- ✅ No map errors in console

**Troubleshooting**:
- If no map: Check if geolocation is enabled
- If markers don't show: CDN for marker icons working?
- Check network tab: OSM tile requests should succeed

---

### Step 3️⃣: Test Fare Estimation
**Action**: With pickup & dropoff set, click "Estimate Fare"

**Expected Result**:
- ✅ API call to `/api/rides/estimate-fare` succeeds (200 OK)
- ✅ Fare card appears showing:
  - Distance (km)
  - Duration (minutes)
  - Base fare
  - Per KM charge
  - Per minute charge
  - **Total fare in ₹**

**Response Format**:
```json
{
  "distance": 12.5,
  "duration": 900,
  "fare": {
    "baseFare": 40,
    "kmCharge": 187.50,
    "minuteCharge": 30,
    "totalFare": 257.50
  },
  "polyline": "..."
}
```

**If Failed**:
- 404: Database not initialized → Run `node init-db.js`
- 500: Check backend logs for route calculation errors
- Network error: Backend might be offline

---

### Step 4️⃣: Test Ride Request
**Action**: Click "Request Ride" button

**Expected Result**:
- ✅ Ride created in database
- ✅ Toast: "Ride requested! Searching for nearby drivers..."
- ✅ Backend logs show ride creation
- ✅ WebSocket connection established

**Response Format**:
```json
{
  "message": "Ride requested successfully",
  "ride": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "requested",
    "pickup": {
      "address": "Current Location",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "dropoff": {
      "address": "Destination",
      "latitude": 28.5244,
      "longitude": 77.1855
    },
    "distance": 12.5,
    "duration": 900,
    "fare": {
      "baseFare": 40,
      "totalFare": 257.50
    }
  }
}
```

---

## API Endpoint Testing (Using Postman/cURL)

### Register Rider
```bash
curl -X POST http://localhost:5000/api/auth/register/rider \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Rider",
    "email": "rider@test.com",
    "phone": "9876543210",
    "password": "password123"
  }'
```

**Expected**: 201 Created + token

---

### Estimate Fare
```bash
curl -X POST http://localhost:5000/api/rides/estimate-fare \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLat": 28.6139,
    "pickupLon": 77.2090,
    "dropoffLat": 28.5244,
    "dropoffLon": 77.1855,
    "vehicleType": "economy"
  }'
```

**Expected**: 200 OK + fare details

---

## Browser Console Checks

### ✅ Should NOT See
```
❌ "Failed to load resource: 404"
❌ "InvalidKeyMapError"
❌ CORS errors
❌ "Uncaught TypeError"
❌ Network errors
```

### ✅ Should See
```
✅ "Fare estimated successfully" (toast)
✅ "Ride requested! Searching for drivers..." (toast)
✅ Map loaded with tiles
✅ Clean console (no errors/warnings)
```

---

## Common Test Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 on register | CORS issue | Backend running on 5000? Check CORS config |
| 400 on register | Missing fields | Fill all form fields: name, email, phone, password |
| Map not showing | Geolocation blocked | Check browser permissions for location |
| Fare not calculating | No pricing data | Run: `cd backend && node init-db.js` |
| WebSocket error | Backend not connected | Verify backend console shows "MongoDB connected" |
| Blank page | Frontend not running | Run: `cd frontend && npm run dev` |

---

## Database State Checks

### Check Pricing Data Initialized
```bash
# Open MongoDB shell:
mongosh

# Run:
use ride_booking_system
db.prices.find()

# Expected output: 3 documents (economy, premium, xl)
```

### Check Created Rider
```bash
db.users.findOne({ email: "rider@test.com" })

# Expected fields: name, email, phone, role: "rider", createdAt
```

### Check Ride Request
```bash
db.rides.findOne({ status: "requested" })

# Expected fields: riderId, pickupLocation, dropoffLocation, fare, status
```

---

## Performance Expectations

| Operation | Expected Time | Notes |
|-----------|---|---|
| Register | < 1s | Creates user + hashes password |
| Login | < 500ms | JWT token generation |
| Estimate fare | < 2s | OSRM routing API call |
| Request ride | < 1s | Database write + WebSocket emit |
| Map load | < 3s | Depends on OSM tile server |

---

## Full Testing Checklist

- [ ] Backend running on 5000
- [ ] Frontend running on 5174
- [ ] MongoDB connected to backend
- [ ] Database initialized (`node init-db.js` run)
- [ ] Can register new rider
- [ ] Map loads with current location
- [ ] Can click map to set locations
- [ ] Fare estimation works
- [ ] Fare displays correctly
- [ ] Can request ride
- [ ] No errors in browser console
- [ ] No errors in backend console
- [ ] Socket.io connection established

---

## Emergency Fixes

**Port already in use?**
```powershell
netstat -ano | findstr :5000
Stop-Process -Id {PID} -Force
```

**Database not initialized?**
```bash
cd backend
node init-db.js
```

**Want fresh database?**
```bash
# Stop backend
# Delete MongoDB data folder or:
# In MongoDB shell: db.dropDatabase()
# Then: npm start
```

---

**System Ready**: ✅ All errors fixed, ready for full testing!
