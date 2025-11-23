import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">3D Surfers</h1>
      <button
        className="w-64 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/play')}
      >
        Play Game
      </button>
      <button
        className="w-64 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/auth')}
      >
        Login / Register
      </button>
      <button
        className="w-64 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/leaderboard')}
      >
        Leaderboard
      </button>
      <button
        className="w-64 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/shop')}
      >
        Shop
      </button>
      <button
        className="w-64 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/settings')}
      >
        Settings
      </button>
    </div>
  );
};

export default MainMenu;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to main menu after logout
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">3D Surfers</h1>
      {isAuthenticated && user && (
        <p className="text-lg text-gray-200">Welcome, <span className="font-bold text-green-400">{user.username}</span>!</p>
      )}
      <button
        className="w-64 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/play')}
      >
        Play Game
      </button>
      {!isAuthenticated ? (
        <button
          className="w-64 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-lg font-semibold transition-colors duration-200"
          onClick={() => navigate('/auth')}
        >
          Login / Register
        </button>
      ) : (
        <button
          className="w-64 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-lg font-semibold transition-colors duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
      <button
        className="w-64 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/leaderboard')}
      >
        Leaderboard
      </button>
      <button
        className="w-64 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/shop')}
      >
        Shop
      </button>
      <button
        className="w-64 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/settings')}
      >
        Settings
      </button>
    </div>
  );
};

export default MainMenu;
