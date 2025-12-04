import L from 'leaflet';

// Fix Leaflet marker icon issue (webpack/vite bundling issue)
// Using jsDelivr CDN which has better privacy compliance
export const initializeLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png'
  });
};

// Custom colored marker icons (using jsDelivr)
export const createMarkerIcon = (color) => {
  const colorMap = {
    green: 'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-green.png',
    red: 'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-red.png',
    blue: 'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-blue.png',
    yellow: 'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-yellow.png',
    orange: 'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-orange.png'
  };

  return new L.Icon({
    iconUrl: colorMap[color] || colorMap.blue,
    shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Preset icons for common use
export const pickupIcon = createMarkerIcon('green');
export const dropoffIcon = createMarkerIcon('red');
export const driverIcon = createMarkerIcon('blue');
export const currentLocationIcon = createMarkerIcon('yellow');

// Location utilities
export const getLocationErrorMessage = (error) => {
  if (!error) return 'Location not available';
  
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Check GPS settings.';
    case error.TIMEOUT:
      return 'Location request timed out. Try again.';
    default:
      return 'Failed to get location: ' + error.message;
  }
};

// Default center for map (fallback if location not available)
export const DEFAULT_MAP_CENTER = [28.7041, 77.1025]; // Delhi, India
export const DEFAULT_ZOOM = 15;

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default {
  initializeLeafletIcons,
  createMarkerIcon,
  pickupIcon,
  dropoffIcon,
  driverIcon,
  currentLocationIcon,
  getLocationErrorMessage,
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM,
  calculateDistance
};
