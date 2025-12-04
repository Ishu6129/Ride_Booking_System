# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register Rider
**POST** `/auth/register/rider`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response (201)**:
```json
{
  "message": "Rider registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "rider"
  }
}
```

---

### Register Driver
**POST** `/auth/register/driver`

```json
{
  "name": "Jane Driver",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "password123",
  "licenseNumber": "DL-2024-12345",
  "vehicleNumber": "ABC1234",
  "vehicleType": "economy"
}
```

**Response (201)**: Same as rider registration

---

### Login
**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "rider"
  }
}
```

---

### Get Profile
**GET** `/auth/profile`
**Auth**: Required

**Response (200)**:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "rider",
  "profileImage": null,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`
**Auth**: Required

```json
{
  "name": "John Updated",
  "phone": "9876543211",
  "profileImage": "image_url"
}
```

---

## Driver Endpoints

### Update Location
**POST** `/driver/location`
**Auth**: Required (Driver only)

```json
{
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Response (200)**:
```json
{
  "message": "Location updated",
  "driver": { /* driver object */ }
}
```

---

### Get Nearby Drivers
**POST** `/driver/nearby`
**Auth**: Required

```json
{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "maxDistance": 5000
}
```

**Response (200)**:
```json
{
  "message": "Nearby drivers found",
  "count": 5,
  "drivers": [
    {
      "_id": "driver_id",
      "name": "Jane Driver",
      "phone": "9876543210",
      "currentLocation": {
        "type": "Point",
        "coordinates": [77.1025, 28.7041]
      },
      "averageRating": 4.8,
      "vehicleType": "economy"
    }
  ]
}
```

---

### Toggle Availability
**PUT** `/driver/availability`
**Auth**: Required (Driver only)

```json
{
  "isOnline": true
}
```

**Response (200)**:
```json
{
  "message": "Driver is now online",
  "isOnline": true
}
```

---

## Ride Endpoints

### Estimate Fare
**POST** `/rides/estimate-fare`

```json
{
  "pickupLat": 28.7041,
  "pickupLon": 77.1025,
  "dropoffLat": 28.7282,
  "dropoffLon": 77.1093,
  "vehicleType": "economy"
}
```

**Response (200)**:
```json
{
  "distance": 2.5,
  "duration": 600,
  "fare": {
    "baseFare": 40,
    "distanceFare": 37.5,
    "durationFare": 20,
    "totalFare": 97.5
  },
  "polyline": "encoded_polyline_string"
}
```

---

### Request Ride
**POST** `/rides/request`
**Auth**: Required

```json
{
  "pickupLat": 28.7041,
  "pickupLon": 77.1025,
  "dropoffLat": 28.7282,
  "dropoffLon": 77.1093,
  "pickupAddress": "Home",
  "dropoffAddress": "Office",
  "vehicleType": "economy"
}
```

**Response (201)**:
```json
{
  "message": "Ride requested successfully",
  "ride": {
    "_id": "ride_id",
    "status": "requested",
    "pickup": {
      "address": "Home",
      "latitude": 28.7041,
      "longitude": 77.1025
    },
    "dropoff": {
      "address": "Office",
      "latitude": 28.7282,
      "longitude": 77.1093
    },
    "distance": 2.5,
    "duration": 600,
    "fare": {
      "baseFare": 40,
      "distanceFare": 37.5,
      "durationFare": 20,
      "totalFare": 97.5,
      "finalFare": 97.5
    }
  }
}
```

---

### Get Ride History
**GET** `/rides/history`
**Auth**: Required

**Response (200)**:
```json
{
  "count": 5,
  "rides": [ /* array of rides */ ]
}
```

---

### Get Ride Details
**GET** `/rides/:rideId`
**Auth**: Required

**Response (200)**: Full ride object with all details

---

### Cancel Ride
**PUT** `/rides/:rideId/cancel`
**Auth**: Required

```json
{
  "reason": "Driver took wrong route"
}
```

**Response (200)**:
```json
{
  "message": "Ride cancelled successfully",
  "ride": { /* ride object */ }
}
```

---

### Rate Ride
**POST** `/rides/:rideId/rate`
**Auth**: Required

```json
{
  "rating": 5,
  "review": "Great driver, safe ride"
}
```

**Response (200)**:
```json
{
  "message": "Ride rated successfully",
  "ride": { /* ride object with rating */ }
}
```

---

## Admin Endpoints

All admin endpoints require **Auth: Required (Admin only)**

### Verify Driver
**POST** `/admin/verify-driver`

```json
{
  "driverId": "driver_id",
  "status": "verified"
}
```

**Response (200)**:
```json
{
  "message": "Driver verified successfully",
  "driver": { /* driver object */ }
}
```

---

### Get All Drivers
**GET** `/admin/drivers`

**Response (200)**:
```json
{
  "count": 10,
  "drivers": [ /* array of drivers */ ]
}
```

---

### Get All Riders
**GET** `/admin/riders`

**Response (200)**:
```json
{
  "count": 50,
  "riders": [ /* array of riders */ ]
}
```

---

### Get All Rides
**GET** `/admin/rides`

**Response (200)**:
```json
{
  "count": 100,
  "rides": [ /* array of rides */ ]
}
```

---

### Update Pricing
**POST** `/admin/pricing`

```json
{
  "vehicleType": "economy",
  "baseFare": 40,
  "perKmCharge": 15,
  "perMinuteCharge": 2,
  "minFare": 40
}
```

**Response (200)**:
```json
{
  "message": "Pricing updated successfully",
  "pricing": {
    "_id": "pricing_id",
    "vehicleType": "economy",
    "baseFare": 40,
    "perKmCharge": 15,
    "perMinuteCharge": 2,
    "minFare": 40,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Get Pricing Structure
**GET** `/admin/pricing/structure`

**Response (200)**:
```json
{
  "count": 3,
  "pricing": [ /* array of pricing for all vehicle types */ ]
}
```

---

### Get Ride Analytics
**GET** `/admin/analytics/rides`

**Response (200)**:
```json
{
  "totalRides": 100,
  "completedRides": 90,
  "cancelledRides": 10,
  "totalRevenue": 9750
}
```

---

## WebSocket Events

### Client → Server

**Driver Online**
```javascript
socket.emit('driver:online', {
  userId: 'driver_id',
  latitude: 28.7041,
  longitude: 77.1025
})
```

**Update Location**
```javascript
socket.emit('driver:location:update', {
  userId: 'driver_id',
  latitude: 28.7041,
  longitude: 77.1025,
  rideId: 'ride_id'
})
```

**Request Ride**
```javascript
socket.emit('ride:request', {
  rideId: 'ride_id',
  riderId: 'rider_id',
  pickupLat: 28.7041,
  pickupLon: 77.1025,
  dropoffLat: 28.7282,
  dropoffLon: 77.1093
})
```

**Accept Ride**
```javascript
socket.emit('ride:accept', {
  rideId: 'ride_id',
  driverId: 'driver_id',
  latitude: 28.7041,
  longitude: 77.1025
})
```

---

### Server → Client

**Ride Accepted**
```javascript
socket.on('ride:accepted', (data) => {
  // data: { driverId, driverLocation, eta }
})
```

**Driver Location Update**
```javascript
socket.on('driver:location:update', (data) => {
  // data: { latitude, longitude, timestamp }
})
```

**Ride Started**
```javascript
socket.on('ride:started', (data) => {
  // data: { status: 'trip started' }
})
```

**Ride Completed**
```javascript
socket.on('ride:completed', (data) => {
  // data: { status: 'trip completed', fare }
})
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "No authentication token, access denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```
