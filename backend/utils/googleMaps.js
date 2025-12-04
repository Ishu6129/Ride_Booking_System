const axios = require('axios');

// Calculate distance using Haversine formula (no API key needed)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate duration based on average speed (50 km/h for estimation)
const estimateDuration = (distance) => {
  const avgSpeedKmh = 50;
  return Math.round((distance / avgSpeedKmh) * 3600); // Return in seconds
};

const getRouteAndDistance = async (pickupLat, pickupLon, dropoffLat, dropoffLon) => {
  try {
    // Calculate distance using Haversine formula
    const distance = haversineDistance(pickupLat, pickupLon, dropoffLat, dropoffLon);
    const duration = estimateDuration(distance);

    // Try to get real route using OSRM (free, no API key required)
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${dropoffLon},${dropoffLat}`,
        {
          params: {
            overview: 'full',
            geometries: 'geojson'
          }
        }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        return {
          distance: Math.round(route.distance / 1000 * 100) / 100, // Convert to km
          duration: Math.round(route.duration), // In seconds
          polyline: route.geometry,
          steps: []
        };
      }
    } catch (osrmError) {
      console.warn('OSRM service unavailable, using Haversine calculation');
    }

    // Fallback to Haversine calculation
    return {
      distance: Math.round(distance * 100) / 100,
      duration,
      polyline: null,
      steps: []
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    // Try Nominatim (free OpenStreetMap geocoding - no API key required)
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json'
      }
    });

    if (response.data && response.data.address) {
      return response.data.address.road || 
             response.data.address.suburb || 
             response.data.address.city || 
             'Unknown Location';
    }

    return 'Unknown Location';
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return 'Unknown Location';
  }
};

module.exports = {
  getRouteAndDistance,
  getAddressFromCoordinates
};

module.exports = {
  getRouteAndDistance,
  getAddressFromCoordinates
};
