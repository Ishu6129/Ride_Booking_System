import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rideAPI } from '../services/api';
import { emitRideRequest, initializeSocket, onRideAccepted, onRideRequestConfirmed } from '../services/socket';
import { useRideStore, useLocationStore } from '../store';
import { ToastContainer, toast } from 'react-toastify';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RiderHome = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);
  const currentRide = useRideStore((state) => state.currentRide);
  const setCurrentRide = useRideStore((state) => state.setCurrentRide);

  // Get current location on mount
  useEffect(() => {
    initializeSocket();

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setPickupLocation(location);
        },
        (error) => toast.error('Failed to get location: ' + error.message),
        { enableHighAccuracy: true }
      );
    }

    // Listen for ride acceptance
    onRideAccepted((data) => {
      setRideStatus('accepted');
      setDriverLocation(data.driverLocation);
      toast.success(`Driver accepted! ETA: ${data.eta} minutes`);
    });

    onRideRequestConfirmed((data) => {
      setRideStatus('searching');
      toast.info(data.status);
    });
  }, []);

  const handleEstimateFare = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.warning('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);
    try {
      const response = await rideAPI.estimateFare({
        pickupLat: pickupLocation.lat,
        pickupLon: pickupLocation.lng,
        dropoffLat: dropoffLocation.lat,
        dropoffLon: dropoffLocation.lng
      });

      setFareEstimate(response.data);
      toast.success('Fare estimated successfully');
    } catch (error) {
      toast.error('Failed to estimate fare');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!fareEstimate) {
      toast.warning('Please estimate fare first');
      return;
    }

    setLoading(true);
    try {
      const response = await rideAPI.requestRide({
        pickupLat: pickupLocation.lat,
        pickupLon: pickupLocation.lng,
        dropoffLat: dropoffLocation.lat,
        dropoffLon: dropoffLocation.lng,
        pickupAddress: 'Current Location',
        dropoffAddress: 'Destination'
      });

      const ride = response.data.ride;
      setCurrentRide(ride);
      
      // Emit ride request via socket
      emitRideRequest({
        rideId: ride._id,
        riderId: ride.riderId,
        pickupLat: pickupLocation.lat,
        pickupLon: pickupLocation.lng,
        dropoffLat: dropoffLocation.lat,
        dropoffLon: dropoffLocation.lng
      });

      toast.success('Ride requested! Searching for nearby drivers...');
    } catch (error) {
      toast.error('Failed to request ride');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    const location = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };

    if (!pickupLocation) {
      setPickupLocation(location);
      toast.info('Pickup location set');
    } else if (!dropoffLocation) {
      setDropoffLocation(location);
      toast.info('Dropoff location set');
    }
  };

  // Map component with click handler
  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      map.on('click', handleMapClick);
      return () => map.off('click', handleMapClick);
    }, [pickupLocation, dropoffLocation, map]);
    return null;
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
            <MapEvents />
            {pickupLocation && (
              <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                <Popup>📍 Pickup Location</Popup>
              </Marker>
            )}
            {dropoffLocation && (
              <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
                <Popup>📍 Dropoff Location</Popup>
              </Marker>
            )}
            {driverLocation && (
              <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                <Popup>🚗 Your Driver</Popup>
              </Marker>
            )}
            {currentLocation && rideStatus !== 'searching' && (
              <Marker position={[currentLocation.lat, currentLocation.lng]}>
                <Popup>📍 Your Location</Popup>
              </Marker>
            )}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      <div className="w-80 bg-white shadow-lg p-6 rounded-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Book a Ride</h2>

        {rideStatus && (
          <div className="bg-blue-100 border border-blue-500 text-blue-700 p-3 rounded mb-4">
            Status: <strong>{rideStatus}</strong>
          </div>
        )}

        <div className="space-y-4">
          {fareEstimate && (
            <div className="card">
              <h3 className="font-semibold mb-2">Fare Estimate</h3>
              <p className="text-gray-600">Distance: {fareEstimate.distance} km</p>
              <p className="text-gray-600">Duration: {Math.round(fareEstimate.duration / 60)} min</p>
              <p className="text-lg font-bold text-blue-600 mt-2">₹ {fareEstimate.fare.totalFare}</p>
            </div>
          )}

          <button
            onClick={handleEstimateFare}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Estimating...' : 'Estimate Fare'}
          </button>

          <button
            onClick={handleRequestRide}
            disabled={loading || !fareEstimate}
            className="btn-primary w-full"
          >
            {loading ? 'Requesting...' : 'Request Ride'}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RiderHome;
