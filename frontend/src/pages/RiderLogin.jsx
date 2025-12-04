import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

export const RiderLogin = () => {
  const [role, setRole] = useState('rider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      setAuth(user, token, user.role || role);
      toast.success('Login successful');

      const targetRole = user.role || role;
      setTimeout(() => {
        if (targetRole === 'driver') navigate('/driver/home');
        else navigate('/rider/home');
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const switchTo = (r) => setRole(r);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => switchTo('rider')}
            className={`px-3 py-1 rounded ${role === 'rider' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Login as Rider
          </button>
          <button
            onClick={() => switchTo('driver')}
            className={`px-3 py-1 rounded ${role === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Login as Driver
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">{role === 'driver' ? 'Driver Login' : 'Rider Login'}</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field mb-6"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mb-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(role === 'driver' ? '/driver/register' : '/rider/register')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RiderLogin;
