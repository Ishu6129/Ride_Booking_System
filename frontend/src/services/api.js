import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  registerRider: (data) => api.post('/auth/register/rider', data),
  registerDriver: (data) => api.post('/auth/register/driver', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Driver API
export const driverAPI = {
  updateLocation: (data) => api.post('/driver/location', data),
  getNearbyDrivers: (data) => api.post('/driver/nearby', data),
  toggleAvailability: (data) => api.put('/driver/availability', data),
  getProfile: () => api.get('/driver/profile'),
  updateProfile: (data) => api.put('/driver/profile', data)
};

// Ride API
export const rideAPI = {
  estimateFare: (data) => api.post('/rides/estimate-fare', data),
  requestRide: (data) => api.post('/rides/request', data),
  getRideHistory: () => api.get('/rides/history'),
  getRideDetails: (rideId) => api.get(`/rides/${rideId}`),
  cancelRide: (rideId, data) => api.put(`/rides/${rideId}/cancel`, data),
  rateRide: (rideId, data) => api.post(`/rides/${rideId}/rate`, data)
};

// Admin API
export const adminAPI = {
  verifyDriver: (data) => api.post('/admin/verify-driver', data),
  getAllDrivers: () => api.get('/admin/drivers'),
  getAllRiders: () => api.get('/admin/riders'),
  getAllRides: () => api.get('/admin/rides'),
  updatePricing: (data) => api.post('/admin/pricing', data),
  getPricingStructure: () => api.get('/admin/pricing/structure'),
  getRideAnalytics: () => api.get('/admin/analytics/rides')
};

export default api;
