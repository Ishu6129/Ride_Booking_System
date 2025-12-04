# Troubleshooting Guide

## Common Issues and Solutions

### 1. MongoDB Connection Error

**Error Message:**
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- Ensure MongoDB is running:
  - On Windows: Check if MongoDB service is running
  - Start MongoDB: `mongod`
- Verify MONGODB_URI in .env is correct
- Check if firewall is blocking port 27017
- If using MongoDB Atlas, ensure connection string is valid

---

### 2. Google Maps API Not Working

**Error:** Map not displaying or showing blank/gray area

**Solutions:**
- Verify API key is valid and enabled
- Enable these APIs in Google Cloud Console:
  - Maps JavaScript API
  - Directions API
  - Geocoding API
- Check API key restrictions (allowed domains/IPs)
- Ensure billing is enabled on Google Cloud project

---

### 3. WebSocket Connection Failed

**Error:** 
```
Failed to establish WebSocket connection
```

**Solutions:**
- Ensure backend server is running on port 5000
- Check CORS settings in server.js
- Verify firewall allows WebSocket connections
- Check browser console for specific errors
- Restart both frontend and backend

---

### 4. Location Permission Denied

**Error:** "Failed to get location"

**Solutions:**
- Grant location permission when browser asks
- Check browser privacy settings
- HTTPS required for production (HTTP okay for localhost)
- Ensure browser has permission to access geolocation
- Try incognito/private mode

---

### 5. JWT Token Errors

**Error:** "Token is not valid" or "Token expired"

**Solutions:**
- Clear browser localStorage and reload
- Log out and log back in
- Ensure JWT_SECRET is same in all requests
- Check token expiration time in middleware
- Try using fresh token from login

---

### 6. Ride Status Not Updating

**Issue:** Ride status remains "requested" or doesn't change

**Solutions:**
- Check WebSocket connection is active
- Verify both rider and driver are using same socket connection
- Check browser console for errors
- Ensure MongoDB is storing ride updates
- Restart backend server

---

### 7. Driver Location Not Showing on Map

**Issue:** Driver marker not appearing or not updating

**Solutions:**
- Ensure driver has "Go Online" enabled
- Check browser location permissions
- Verify driver location update frequency (watchPosition)
- Check if coordinates are valid (lat -90 to 90, lon -180 to 180)
- Try refreshing page

---

### 8. Port Already in Use

**Error:** 
```
listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
- Change PORT in .env file
- Kill existing process using port 5000:
  ```bash
  # PowerShell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  
  # Command Prompt
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

---

### 9. npm Install Fails

**Error:** Various npm related errors

**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Try again: `npm install`
- Check Node.js version: `node --version` (should be 16+)
- Try using npm ci instead: `npm ci`

---

### 10. CORS Errors

**Error:** 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
- Verify CORS is enabled in server.js
- Check frontend URL matches backend CORS config
- Ensure API requests include proper headers
- For development, CORS should allow all origins

**In server.js:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---

### 11. Map Clicks Not Working

**Issue:** Can't set pickup/dropoff by clicking on map

**Solutions:**
- Check if loadingScript from @react-google-maps/api is complete
- Verify Google Maps API key is valid
- Ensure map container has proper styling and height
- Check browser console for Google Maps specific errors

---

### 12. Ride Request Not Appearing to Driver

**Issue:** Driver doesn't see ride request notification

**Solutions:**
- Ensure driver is online and in right room/channel
- Check WebSocket connection is active
- Verify ride is broadcast to correct driver
- Check browser console for socket errors
- Try refreshing driver page

---

### 13. Email Already Exists Error on Register

**Error:** "User already exists with this email or phone"

**Solutions:**
- Use different email/phone
- Check if user was partially created in previous attempt
- Try logging in with existing credentials
- Contact admin to reset account if needed

---

### 14. Fare Estimation Not Working

**Issue:** Estimate Fare button returns error

**Solutions:**
- Ensure both pickup and dropoff are selected
- Verify Google Maps API has Directions API enabled
- Check coordinates are valid
- Ensure route exists between locations
- Check Google Maps API quota

---

### 15. Database Data Not Persisting

**Issue:** Data saved but disappears after restart

**Solutions:**
- Verify MongoDB is properly saving data
- Check MONGODB_URI points to correct database
- Ensure data validation in schema
- Check indexes are created: `db.getCollection('users').getIndexes()`
- Try connecting directly to MongoDB: `mongosh`

---

## Debug Mode

Enable verbose logging in backend:

```javascript
// In server.js, add before mongoose.connect():
mongoose.set('debug', true);

// Or in individual controllers:
console.log('Debug:', req.body);
```

In frontend, check browser DevTools:
- **Console Tab**: JavaScript errors
- **Network Tab**: API request/response
- **Storage Tab**: localStorage, cookies
- **Application Tab**: WebSocket activity

---

## Performance Issues

### Slow Ride Matching
- Check MongoDB indexes on location field
- Verify geospatial index: `db.drivers.getIndexes()`
- Increase maxDistance radius in config

### High Memory Usage
- Check for memory leaks in WebSocket listeners
- Monitor Node.js process: `node --inspect server.js`
- Use Chrome DevTools to profile

### Slow API Responses
- Check MongoDB slow query log
- Add pagination to list endpoints
- Reduce data returned per request
- Use projection to select specific fields

---

## Reset Everything

If having persistent issues:

```bash
# 1. Stop all services
# 2. Clear frontend
cd frontend
del node_modules package-lock.json
npm install

# 3. Clear backend  
cd ../backend
del node_modules package-lock.json
npm install

# 4. Clear MongoDB data
mongosh
use ride_booking_system
db.dropDatabase()

# 5. Restart services
```

---

## Getting Help

1. Check browser console (F12)
2. Check backend logs in terminal
3. Check MongoDB connection
4. Search GitHub issues
5. Create new issue with:
   - Error message
   - Steps to reproduce
   - Browser/OS info
   - Screenshots

---

## Testing Checklist

- [ ] MongoDB running locally
- [ ] Google Maps API key valid
- [ ] .env files configured
- [ ] npm install completed for both folders
- [ ] Backend starts without errors
- [ ] Frontend builds without errors
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can request ride
- [ ] WebSocket connects
- [ ] Can see real-time updates

---
