import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

export const DriverRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: 'economy'
  });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.registerDriver(formData);
      const { token, user } = response.data;

      setAuth(user, token, 'driver');
      toast.success('Registration successful');
      
      setTimeout(() => {
        navigate('/driver/home');
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      console.error('Registration error:', error.response?.data || error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Driver Registration</h2>
        <form onSubmit={handleRegister} className="max-h-96 overflow-y-auto">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="input-field mb-4"
            required
          />
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="input-field mb-4"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium</option>
            <option value="xl">XL</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field mb-6"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full mb-4"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/driver/login')}
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DriverRegister;
