import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import useAuthStore from '../stores/authStore';

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        console.log('Attempting login with:', { username, password });
        const response = await login(username, password);
        setAuth(response.token, response.user);
        navigate('/'); // Go back to main menu on success
      } else {
        console.log('Attempting registration with:', { username, password });
        await register(username, password); // Register doesn't auto-login
        alert('Registration successful! Please login.');
        setIsLogin(true); // Switch to login view
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold transition-colors duration-200"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        className="mt-4 text-blue-400 hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? 'Need an account? Register here.'
          : 'Already have an account? Login here.'}
      </button>
      <button
        className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm transition-colors duration-200"
        onClick={() => navigate('/')}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default LoginRegister;
