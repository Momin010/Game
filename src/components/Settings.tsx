import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-6 text-gray-300">Settings</h2>
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
          <span className="text-white text-lg">Music Volume</span>
          <input type="range" min="0" max="100" value="50" className="w-1/2" />
        </div>
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
          <span className="text-white text-lg">SFX Volume</span>
          <input type="range" min="0" max="100" value="75" className="w-1/2" />
        </div>
        <button
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-lg font-semibold transition-colors duration-200"
          onClick={() => alert('Resetting game data... (Not implemented)')}
        >
          Reset Game Data
        </button>
      </div>
      <button
        className="mt-8 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-lg font-semibold transition-colors duration-200"
        onClick={() => navigate('/')}
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default Settings;
