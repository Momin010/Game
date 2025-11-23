import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useKeyboardControls, KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../stores/gameStore';
import useAuthStore from '../stores/authStore';
import { submitScore } from '../services/apiService';

// --- Game Components (Simplified for initial setup) ---

interface PlayerProps {
  onCollision: (type: 'obstacle' | 'coin', objectId: string) => void;
}

const Player: React.FC<PlayerProps> = ({ onCollision }) => {
  const playerRef = useRef<THREE.Mesh>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { currentLane, setLane, jump, setJump, isJumping, setIsJumping, playerZ, gameOver } = useGameStore();

  const lanePositions = [-1.5, 0, 1.5]; // Left, Center, Right
  const jumpHeight = 1.2;
  const jumpDuration = 0.3; // seconds for half arc (up or down)
  const jumpStartRef = useRef(0);

  useEffect(() => {
    // Only subscribe if game is not over
    if (gameOver) return; 

    const unsub = subscribeKeys(
      (state) => state.left,
      (pressed) => {
        if (pressed && currentLane > 0) setLane(currentLane - 1);
      }
    );
    const unsub2 = subscribeKeys(
      (state) => state.right,
      (pressed) => {
        if (pressed && currentLane < lanePositions.length - 1) setLane(currentLane + 1);
      }
    );
    const unsub3 = subscribeKeys(
      (state) => state.jump,
      (pressed) => {
        if (pressed && !isJumping) {
          setJump(true); // Signal jump start
          setIsJumping(true);
          jumpStartRef.current = Date.now();
        }
      }
    );
    return () => { unsub(); unsub2(); unsub3(); };
  }, [subscribeKeys, currentLane, setLane, isJumping, setIsJumping, setJump, lanePositions.length, gameOver]);

  useFrame((state, delta) => {
    if (!playerRef.current || gameOver) return; // Stop player movement if game over

    // Smoothly move player horizontally to the target lane
    const targetX = lanePositions[currentLane];
    playerRef.current.position.x = THREE.MathUtils.lerp(
      playerRef.current.position.x,
      targetX,
      0.15 // Lerp factor for smooth movement
    );

    // Handle jump animation
    if (isJumping) {
      const elapsed = (Date.now() - jumpStartRef.current) / 1000;
      const jumpProgress = elapsed / (jumpDuration * 2); // Full duration for up and down

      if (jumpProgress < 1) {
        // Calculate Y position based on a sine wave for smooth jump arc
        playerRef.current.position.y = Math.sin(jumpProgress * Math.PI) * jumpHeight;
      } else {
        // Landed
        playerRef.current.position.y = 0; 
        setIsJumping(false);
        setJump(false);
      }
    }

    // Collision detection (simplified bounding box)
    const playerBox = new THREE.Box3().setFromObject(playerRef.current);

    // Get all game objects from store
    const { obstacles, collectibles } = useGameStore.getState();

    // Check for obstacle collisions
    for (const obstacle of obstacles) {
      const obstacleMesh = state.scene.getObjectByName(obstacle.id);
      if (obstacleMesh) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacleMesh);
        if (playerBox.intersectsBox(obstacleBox)) {
          onCollision('obstacle', obstacle.id);
          return; // Stop checking after first collision
        }
      }
    }

    // Check for collectible (coin) collisions
    for (const coin of collectibles) {
      const coinMesh = state.scene.getObjectByName(coin.id);
      if (coinMesh) {
        const coinBox = new THREE.Box3().setFromObject(coinMesh);
        if (playerBox.intersectsBox(coinBox)) {
          onCollision('coin', coin.id);
          // No return here, can collect multiple coins in one frame if lucky
        }
      }
    }
  });

  return (
    <mesh ref={playerRef} position={[lanePositions[currentLane], 0, playerZ]} castShadow name="player">
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

interface ObstacleProps {
  position: [number, number, number];
  id: string;
}

const Obstacle: React.FC<ObstacleProps> = ({ position, id }) => {
  return (
    <mesh position={position} castShadow name={id}> {/* Use 'name' for lookup */}
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

interface CoinProps {
  position: [number, number, number];
  id: string;
}

const Coin: React.FC<CoinProps> = ({ position, id }) => {
  const coinRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.05;
    }
  });

  return (
    <mesh ref={coinRef} position={position} castShadow name={id}> {/* Use 'name' for lookup */}
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
};

interface GroundProps {
  playerZ: number;
}

const Ground: React.FC<GroundProps> = ({ playerZ }) => {
  const segments = [];
  const segmentLength = 20; 
  const numSegments = 5; 

  const startZ = Math.floor(playerZ / segmentLength) * segmentLength - (numSegments / 2) * segmentLength; // Adjusted to be more stable

  for (let i = 0; i < numSegments; i++) {
    const zPos = startZ + i * segmentLength;
    segments.push(
      <mesh receiveShadow position={[0, -0.5, zPos]} key={i + zPos} > 
        <boxGeometry args={[5, 1, segmentLength]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
    );
  }
  return <>{segments}</>;
};

// --- Game Controls Mapping ---
const map = [
  { name: 'left', keys: ['ArrowLeft', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'D'] },
  { name: 'jump', keys: ['ArrowUp', 'W', 'Space'] },
];

// --- Main Game Component ---
const Game: React.FC = () => {
  const navigate = useNavigate();
  const {
    score, setScore,
    coins, setCoins,
    gameOver, setGameOver,
    gameStarted, setGameStarted,
    playerZ, setPlayerZ,
    obstacles, setObstacles,
    collectibles, setCollectibles,
    resetGame
  } = useGameStore();

  const { isAuthenticated, user, setAuth } = useAuthStore(); // Access auth store

  const gameSpeed = useRef(0.1);
  const obstacleSpawnInterval = 1500; // ms
  const collectibleSpawnInterval = 800; // ms
  const lastObstacleSpawnTime = useRef(0);
  const lastCollectibleSpawnTime = useRef(0);
  const initialPlayerZ = 0; // Starting point for player Z
  const lanePositions = [-1.5, 0, 1.5];

  const handleCollision = useCallback((type: 'obstacle' | 'coin', objectId: string) => {
    if (gameOver) return;

    if (type === 'obstacle') {
      console.log('Collision with obstacle! Game Over!');
      setGameOver(true);
    } else if (type === 'coin') {
      setCoins(coins + 1);
      setCollectibles(prev => prev.filter(c => c.id !== objectId)); // Remove collected coin
      // console.log('Collected coin! Total coins:', coins + 1);
    }
  }, [coins, gameOver, setCoins, setCollectibles, setGameOver]);

  useFrame((state, delta) => {
    if (!gameStarted || gameOver) return;

    // Increase game speed over time
    gameSpeed.current += delta * 0.001; // Accelerate slowly
    const currentSpeed = gameSpeed.current;

    // Move player forward (by updating playerZ, which moves camera and ground)
    setPlayerZ(playerZ - currentSpeed); // Negative because Z-axis typically points out of screen

    // Score update
    setScore(score + currentSpeed * 100); // Score based on distance/speed

    // Spawn Obstacles
    if (Date.now() - lastObstacleSpawnTime.current > obstacleSpawnInterval / currentSpeed) { // Faster spawning with speed
      const lane = Math.floor(Math.random() * lanePositions.length);
      const zOffset = Math.random() * 10 + 20; // Spawn 20-30 units ahead of current playerZ
      const newObstacle = {
        id: `obstacle-${Date.now()}-${Math.random()}`,
        position: [lanePositions[lane], 0, playerZ - zOffset] as [number, number, number],
        type: 'obstacle'
      };
      setObstacles(prev => [...prev, newObstacle]);
      lastObstacleSpawnTime.current = Date.now();
    }

    // Spawn Collectibles (Coins)
    if (Date.now() - lastCollectibleSpawnTime.current > collectibleSpawnInterval / currentSpeed) { // Faster spawning with speed
      const lane = Math.floor(Math.random() * lanePositions.length);
      const zOffset = Math.random() * 10 + 10; // Spawn 10-20 units ahead of current playerZ
      const newCoin = {
        id: `coin-${Date.now()}-${Math.random()}`,
        position: [lanePositions[lane], 0.5, playerZ - zOffset] as [number, number, number],
        type: 'coin'
      };
      setCollectibles(prev => [...prev, newCoin]);
      lastCollectibleSpawnTime.current = Date.now();
    }

    // Despawn old objects (obstacles and collectibles) that are far behind the player
    // Only keep objects that are ahead of playerZ + a buffer (e.g., 5 units)
    setObstacles(prev => prev.filter(obj => obj.position[2] < playerZ + 5));
    setCollectibles(prev => prev.filter(obj => obj.position[2] < playerZ + 5));
  });

  useEffect(() => {
    if (gameOver) {
      console.log('Game Over! Final Score:', Math.floor(score), 'Coins:', coins);
      // If user is authenticated, submit score
      if (isAuthenticated && user) {
        console.log('Submitting score for user:', user.username);
        submitScore(Math.floor(score), coins)
          .then(response => {
            console.log('Score submission response:', response);
            // Update user's high score and coins in auth store if it was updated
            if (response.updated || response.coins !== user.coins) {
              setAuth(user.token!, { ...user, high_score: response.high_score, coins: response.coins });
            }
          })
          .catch(err => {
            console.error('Error submitting score:', err);
          });
      }
      // Reset game state and navigate after a short delay to show game over screen
      // The button below also handles navigation, so this timeout will just show the screen.
    }
  }, [gameOver, score, coins, isAuthenticated, user, setAuth]);

  // Start game on mount and clean up on unmount
  useEffect(() => {
    setGameStarted(true);
    gameSpeed.current = 0.1; // Reset speed for new game
    setPlayerZ(initialPlayerZ); // Ensure player Z starts at 0
    return () => {
      resetGame(); // Ensure state is reset on unmount
    };
  }, [setGameStarted, resetGame, setPlayerZ]);

  return (
    <div className="w-full h-full relative">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold z-10">
        Score: {Math.floor(score)}
      </div>
      <div className="absolute top-4 right-4 text-white text-xl font-bold z-10">
        Coins: {coins}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-red-500 mb-4">GAME OVER!</h2>
            <p className="text-3xl text-white">Final Score: {Math.floor(score)}</p>
            <p className="text-xl text-yellow-400 mt-2">Coins Collected: {coins}</p>
            <button
              className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-md text-2xl font-semibold transition-colors duration-200"
              onClick={() => {
                resetGame();
                navigate('/');
              }}
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
          {/* Camera positioning: [x, y, z] - z position relative to player's current Z for follow effect */}
          <PerspectiveCamera makeDefault position={[0, 2, playerZ + 5]} /> 
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />

          {/* Ground is rendered relative to player's Z position */}
          <Ground playerZ={playerZ} />
          
          {/* Player controlled by keyboard */} 
          <Player onCollision={handleCollision} />

          {/* Obstacles and Collectibles */}
          {obstacles.map(obj => (
            <Obstacle key={obj.id} id={obj.id} position={obj.position} />
          ))}
          {collectibles.map(obj => (
            <Coin key={obj.id} id={obj.id} position={obj.position} />
          ))}

        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default Game;
