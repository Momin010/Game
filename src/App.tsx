import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import LoginRegister from './components/LoginRegister';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Shop from './components/Shop';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<Game />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </div>
  );
}

export default App;
import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import LoginRegister from './components/LoginRegister';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Shop from './components/Shop';
import useAuthStore from './stores/authStore';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<Game />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </div>
  );
}

export default App;
