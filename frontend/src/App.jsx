import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import RiderLogin from './pages/RiderLogin';
import RiderRegister from './pages/RiderRegister';
import DriverLogin from './pages/DriverLogin';
import DriverRegister from './pages/DriverRegister';

// Rider Pages
import RiderHome from './pages/RiderHome';

// Driver Pages
import DriverHome from './pages/DriverHome';

import './index.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Landing page - redirect to rider login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rider Routes */}
        <Route path="/login" element={<RiderLogin />} />
        <Route path="/rider/register" element={<RiderRegister />} />
        <Route
          path="/rider/home"
          element={
            <ProtectedRoute requiredRole="rider">
              <RiderHome />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/register" element={<DriverRegister />} />
        <Route
          path="/driver/home"
          element={
            <ProtectedRoute requiredRole="driver">
              <DriverHome />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
