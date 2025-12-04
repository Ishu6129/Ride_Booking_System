import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { rideAPI } from '../services/api';
import { emitRideRequest, initializeSocket, onRideAccepted, onRideRequestConfirmed } from '../services/socket';
import { useRideStore } from '../store';
import { ToastContainer, toast } from 'react-toastify';
import {
  initializeLeafletIcons,
  pickupIcon,
  dropoffIcon,
  driverIcon,
  currentLocationIcon,
  getLocationErrorMessage,
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM
} from '../utils/leafletUtils';

// Initialize Leaflet icons once
initializeLeafletIcons();

export const RiderHome = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState('economy');
  const [locationError, setLocationError] = useState(null);
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
          if (!pickupLocation) {
            setPickupLocation(location);
          }
          setLocationError(null);
        },
        (error) => {
          const errorMessage = getLocationErrorMessage(error);
          setLocationError(errorMessage);
          toast.error(errorMessage);
          // Set default location so map can still load
          setCurrentLocation({
            lat: DEFAULT_MAP_CENTER[0],
            lng: DEFAULT_MAP_CENTER[1]
          });
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported');
      // Set default location so map can still load
      setCurrentLocation({
        lat: DEFAULT_MAP_CENTER[0],
        lng: DEFAULT_MAP_CENTER[1]
      });
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

    return () => {
      // Cleanup
    };
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
        dropoffLon: dropoffLocation.lng,
        vehicleType: vehicleType
      });

      setFareEstimate(response.data);
      toast.success('Fare estimated successfully');
    } catch (error) {
      console.error('Fare estimation error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to estimate fare');
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
        dropoffAddress: 'Destination',
        vehicleType: vehicleType
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
        dropoffLon: dropoffLocation.lng,
        vehicleType: vehicleType
      });

      toast.success('Ride requested! Searching for nearby drivers...');
    } catch (error) {
      console.error('Ride request error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        config: error.config?.data
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to request ride';
      toast.error(errorMessage);
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
    <div className="flex h-screen gap-4 bg-gray-50">
      <div className="flex-1">
        {currentLocation ? (
          <MapContainer 
            center={[currentLocation.lat, currentLocation.lng]} 
            zoom={DEFAULT_ZOOM} 
            className="w-full h-full rounded-lg"
            style={{ zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
            <MapEvents />
            {pickupLocation && (
              <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>📍 Pickup Location</strong>
                    <p className="text-xs text-gray-600">{pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {dropoffLocation && (
              <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>📍 Dropoff Location</strong>
                    <p className="text-xs text-gray-600">{dropoffLocation.lat.toFixed(4)}, {dropoffLocation.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {driverLocation && (
              <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>🚗 Your Driver</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            {currentLocation && rideStatus !== 'searching' && !pickupLocation && (
              <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon}>
                <Popup>📍 Your Current Location</Popup>
              </Marker>
            )}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 mb-2">Loading map...</p>
              {locationError && <p className="text-red-500 text-sm max-w-xs">{locationError}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="w-96 bg-white shadow-lg p-6 rounded-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Book a Ride</h2>

        {rideStatus && (
          <div className="bg-blue-100 border border-blue-500 text-blue-700 p-3 rounded mb-4">
            Status: <strong>{rideStatus.toUpperCase()}</strong>
          </div>
        )}

        <div className="space-y-4">
          {/* Vehicle Type Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
                setFareEstimate(null); // Reset fare when vehicle type changes
              }}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="economy">🚗 Economy (₹15/km)</option>
              <option value="premium">🚙 Premium (₹20/km)</option>
              <option value="xl">🚐 XL (₹25/km)</option>
            </select>
          </div>

          {/* Locations Info */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">📍 Pickup: {pickupLocation ? 'Set' : 'Not set'}</p>
            <p className="text-sm text-gray-600">📍 Dropoff: {dropoffLocation ? 'Set' : 'Not set'}</p>
          </div>

          {/* Fare Estimate */}
          {fareEstimate && (
            <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-900">Fare Estimate</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Distance:</span>
                  <span className="font-semibold">{fareEstimate.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-semibold">{Math.round(fareEstimate.duration / 60)} min</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg">
                  <span className="text-blue-900 font-bold">Total Fare:</span>
                  <span className="text-blue-600 font-bold">₹ {fareEstimate.fare.totalFare}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleEstimateFare}
            disabled={loading || !pickupLocation || !dropoffLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Estimating...' : 'Estimate Fare'}
          </button>

          <button
            onClick={handleRequestRide}
            disabled={loading || !fareEstimate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Requesting...' : 'Request Ride'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            💡 Click on map to set pickup and dropoff locations
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RiderHome;
