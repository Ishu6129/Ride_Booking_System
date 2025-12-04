import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { driverAPI, rideAPI } from '../services/api';
import { 
  emitDriverOnline, 
  initializeSocket, 
  onRideRequestConfirmed,
  onRideAccepted,
  emitRideAccept,
  emitLocationUpdate,
  emitRideStart,
  emitRideComplete
} from '../services/socket';
import { useDriverStore, useAuthStore } from '../store';
import { ToastContainer, toast } from 'react-toastify';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

export const DriverHome = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [nearbyRides, setNearbyRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const socket = initializeSocket();

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);

          // Update location when online
          if (isOnline && userId) {
            emitLocationUpdate({
              userId,
              latitude: location.lat,
              longitude: location.lng
            });
          }
        },
        (error) => toast.error('Failed to get location: ' + error.message),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline, userId]);

  const handleToggleOnline = async () => {
    setLoading(true);
    try {
      await driverAPI.toggleAvailability({ isOnline: !isOnline });

      if (!isOnline && currentLocation) {
        emitDriverOnline({
          userId,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng
        });
      }

      setIsOnline(!isOnline);
      toast.success(isOnline ? 'You are now offline' : 'You are now online');
    } catch (error) {
      toast.error('Failed to toggle availability');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await rideAPI.getRideDetails(rideId);

      emitRideAccept({
        rideId,
        driverId: userId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng
      });

      toast.success('Ride accepted! Navigate to pickup location.');
    } catch (error) {
      toast.error('Failed to accept ride');
    }
  };

  const handleStartTrip = (rideId) => {
    emitRideStart({
      rideId,
      driverId: userId
    });
    toast.success('Trip started!');
  };

  const handleCompleteTrip = (rideId, fare) => {
    emitRideComplete({
      rideId,
      driverId: userId,
      finalFare: fare
    });
    toast.success('Trip completed!');
  };

  return (
    <div className="flex h-screen gap-4">
      <div className="flex-1">
        {currentLocation ? (
          <MapContainer center={[currentLocation.lat, currentLocation.lng]} zoom={15} className="w-full h-full rounded-lg">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>📍 Your Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      <div className="w-80 bg-white shadow-lg p-6 rounded-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>

        <div className="mb-6">
          <button
            onClick={handleToggleOnline}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isOnline
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {isOnline && (
          <div className="bg-green-100 border border-green-500 text-green-700 p-3 rounded mb-4">
            🟢 Online and visible to riders
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Available Rides</h3>
          {nearbyRides.length === 0 ? (
            <p className="text-gray-500">No rides available at the moment</p>
          ) : (
            nearbyRides.map((ride) => (
              <div key={ride._id} className="card">
                <p className="font-semibold">Pickup: {ride.pickupLocation.address}</p>
                <p className="text-sm text-gray-600">Distance: {ride.distance} km</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹ {ride.fare.totalFare}</p>
                <button
                  onClick={() => handleAcceptRide(ride._id)}
                  className="btn-primary w-full mt-3"
                >
                  Accept Ride
                </button>
              </div>
            ))
          )}
        </div>

        {currentLocation && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <p className="text-xs text-gray-600">
              Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default DriverHome;
