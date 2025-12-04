import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,

  setAuth: (user, token, role) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user, token, role });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, token: null, role: null });
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
}));

export const useRideStore = create((set) => ({
  currentRide: null,
  rides: [],
  rideHistory: [],

  setCurrentRide: (ride) => set({ currentRide: ride }),

  setRides: (rides) => set({ rides }),

  setRideHistory: (history) => set({ rideHistory: history }),

  addToHistory: (ride) => set((state) => ({
    rideHistory: [ride, ...state.rideHistory]
  })),

  clearCurrentRide: () => set({ currentRide: null })
}));

export const useLocationStore = create((set) => ({
  pickup: null,
  dropoff: null,
  currentLocation: null,

  setPickup: (location) => set({ pickup: location }),

  setDropoff: (location) => set({ dropoff: location }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  clearLocations: () => set({ pickup: null, dropoff: null })
}));

export const useDriverStore = create((set) => ({
  isOnline: false,
  currentLocation: null,
  currentRide: null,
  availableRides: [],

  setOnline: (isOnline) => set({ isOnline }),

  setCurrentLocation: (location) => set({ currentLocation: location }),

  setCurrentRide: (ride) => set({ currentRide: ride }),

  setAvailableRides: (rides) => set({ availableRides: rides }),

  clearCurrentRide: () => set({ currentRide: null })
}));
