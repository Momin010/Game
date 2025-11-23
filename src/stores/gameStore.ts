import { create } from 'zustand';

interface GameObject {
  id: string;
  position: [number, number, number];
  type: 'obstacle' | 'coin';
}

interface GameState {
  score: number;
  coins: number;
  gameOver: boolean;
  gameStarted: boolean;
  playerZ: number;
  currentLane: number; // 0: left, 1: center, 2: right
  isJumping: boolean;
  obstacles: GameObject[];
  collectibles: GameObject[];
  
  setScore: (score: number) => void;
  setCoins: (coins: number) => void;
  setGameOver: (gameOver: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setPlayerZ: (z: number) => void;
  setLane: (lane: number) => void;
  setIsJumping: (jumping: boolean) => void;
  setObstacles: (obstacles: GameObject[]) => void;
  setCollectibles: (collectibles: GameObject[]) => void;
  
  // For player actions which might be read by useKeyboardControls
  jump: boolean;
  setJump: (jump: boolean) => void;

  resetGame: () => void;
}

const useGameStore = create<GameState>((set) => ({
  score: 0,
  coins: 0,
  gameOver: false,
  gameStarted: false,
  playerZ: 0,
  currentLane: 1, // Start in center lane
  isJumping: false,
  obstacles: [],
  collectibles: [],
  jump: false,

  setScore: (score) => set({ score }),
  setCoins: (coins) => set({ coins }),
  setGameOver: (gameOver) => set({ gameOver }),
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setPlayerZ: (playerZ) => set({ playerZ }),
  setLane: (currentLane) => set({ currentLane }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setObstacles: (obstacles) => set({ obstacles }),
  setCollectibles: (collectibles) => set({ collectibles }),
  setJump: (jump) => set({ jump }),

  resetGame: () =>
    set({
      score: 0,
      coins: 0,
      gameOver: false,
      gameStarted: false,
      playerZ: 0,
      currentLane: 1,
      isJumping: false,
      obstacles: [],
      collectibles: [],
      jump: false,
    }),
}));

export default useGameStore;
