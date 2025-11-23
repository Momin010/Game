import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getToken()}`,
  },
});

interface ScoreEntry {
  username: string;
  high_score: number;
}

interface SubmitScoreResponse {
  message: string;
  high_score: number;
  coins: number;
  updated: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'board' | 'trail';
  price: number;
  owned: boolean; // This will be determined by backend based on user's owned_items
  equipped: boolean; // Determined by backend based on user's equipped items
}

interface UserProfile {
  high_score: number;
  coins: number;
  current_character: string;
  owned_items: string[];
}

// Leaderboard API calls
export const getLeaderboard = async (): Promise<ScoreEntry[]> => {
  try {
    const response = await axios.get<ScoreEntry[]>(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch leaderboard';
  }
};

export const submitScore = async (score: number, coinsCollected: number): Promise<SubmitScoreResponse> => {
  try {
    const response = await axios.post<SubmitScoreResponse>(
      `${API_URL}/leaderboard/submit`,
      { score, coinsCollected },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to submit score';
  }
};

// Shop/User API calls (placeholder for now, will be implemented in Task 8)
export const getShopItems = async (): Promise<{ items: ShopItem[], userCoins: number, currentCharacter: string }> => {
  // In a real scenario, this would fetch the full item list + user-specific owned/equipped status
  // For now, return mock data combined with user's actual coins/character
  // Assuming user profile can be fetched separately or is part of auth context
  console.warn("getShopItems is using mock data heavily. Implement backend logic in Task 8.");
  const mockItems: ShopItem[] = [
    { id: 'char_default', name: 'Default Runner', type: 'character', price: 0, owned: true, equipped: true },
    { id: 'char_punk', name: 'Punk Dude', type: 'character', price: 1000, owned: false, equipped: false },
    { id: 'char_robot', name: 'Robot Racer', type: 'character', price: 2500, owned: false, equipped: false },
    { id: 'board_basic', name: 'Basic Board', type: 'board', price: 0, owned: true, equipped: true },
    { id: 'board_speed', name: 'Speed Board', type: 'board', price: 800, owned: false, equipped: false },
    { id: 'trail_none', name: 'No Trail', type: 'trail', price: 0, owned: true, equipped: true },
    { id: 'trail_sparkle', name: 'Sparkle Trail', type: 'trail', price: 500, owned: false, equipped: false },
  ];

  // Mock user profile. In a real app, this would come from a /api/user/profile endpoint
  const userProfile: UserProfile = {
    high_score: 1000, coins: 2500, current_character: 'char_default',
    owned_items: ['char_default', 'board_basic', 'trail_none', 'char_punk'] // Example
  };

  const itemsWithStatus: ShopItem[] = mockItems.map(item => ({
    ...item,
    owned: userProfile.owned_items.includes(item.id),
    equipped: (item.type === 'character' && item.id === userProfile.current_character) ||
              (item.type === 'board' && item.id === 'board_basic' && userProfile.owned_items.includes('board_basic')) || // Mocking specific equipped logic
              (item.type === 'trail' && item.id === 'trail_none' && userProfile.owned_items.includes('trail_none')) // Mocking specific equipped logic
  }));

  return { items: itemsWithStatus, userCoins: userProfile.coins, currentCharacter: userProfile.current_character };
};

export const buyItem = async (itemId: string): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(
      `${API_URL}/shop/buy`,
      { itemId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to buy item';
  }
};

export const equipItem = async (itemId: string): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(
      `${API_URL}/shop/equip`,
      { itemId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to equip item';
  }
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/user/profile`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch user profile';
  }
}
import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getToken()}`,
  },
});

interface ScoreEntry {
  username: string;
  high_score: number;
}

interface SubmitScoreResponse {
  message: string;
  high_score: number;
  coins: number;
  updated: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'board' | 'trail';
  price: number;
  owned: boolean; // This will be determined by backend based on user's owned_items
  equipped: boolean; // Determined by backend based on user's equipped items
}

interface UserProfile {
  high_score: number;
  coins: number;
  current_character: string;
  owned_items: string[];
}

// Leaderboard API calls
export const getLeaderboard = async (): Promise<ScoreEntry[]> => {
  try {
    const response = await axios.get<ScoreEntry[]>(`${API_URL}/leaderboard`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch leaderboard';
  }
};

export const submitScore = async (score: number, coinsCollected: number): Promise<SubmitScoreResponse> => {
  try {
    const response = await axios.post<SubmitScoreResponse>(
      `${API_URL}/leaderboard/submit`,
      { score, coinsCollected },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to submit score';
  }
};

// Shop/User API calls (placeholder for now, will be implemented in Task 8)
export const getShopItems = async (): Promise<{ items: ShopItem[], userCoins: number, currentCharacter: string }> => {
  // In a real scenario, this would fetch the full item list + user-specific owned/equipped status
  // For now, return mock data combined with user's actual coins/character
  // Assuming user profile can be fetched separately or is part of auth context
  console.warn("getShopItems is using mock data heavily. Implement backend logic in Task 8.");
  const mockItems: ShopItem[] = [
    { id: 'char_default', name: 'Default Runner', type: 'character', price: 0, owned: true, equipped: true },
    { id: 'char_punk', name: 'Punk Dude', type: 'character', price: 1000, owned: false, equipped: false },
    { id: 'char_robot', name: 'Robot Racer', type: 'character', price: 2500, owned: false, equipped: false },
    { id: 'board_basic', name: 'Basic Board', type: 'board', price: 0, owned: true, equipped: true },
    { id: 'board_speed', name: 'Speed Board', type: 'board', price: 800, owned: false, equipped: false },
    { id: 'trail_none', name: 'No Trail', type: 'trail', price: 0, owned: true, equipped: true },
    { id: 'trail_sparkle', name: 'Sparkle Trail', type: 'trail', price: 500, owned: false, equipped: false },
  ];

  // Mock user profile. In a real app, this would come from a /api/user/profile endpoint
  const userProfile: UserProfile = {
    high_score: 1000, coins: 2500, current_character: 'char_default',
    owned_items: ['char_default', 'board_basic', 'trail_none', 'char_punk'] // Example
  };

  const itemsWithStatus: ShopItem[] = mockItems.map(item => ({
    ...item,
    owned: userProfile.owned_items.includes(item.id),
    equipped: (item.type === 'character' && item.id === userProfile.current_character) ||
              (item.type === 'board' && item.id === 'board_basic' && userProfile.owned_items.includes('board_basic')) || // Mocking specific equipped logic
              (item.type === 'trail' && item.id === 'trail_none' && userProfile.owned_items.includes('trail_none')) // Mocking specific equipped logic
  }));

  return { items: itemsWithStatus, userCoins: userProfile.coins, currentCharacter: userProfile.current_character };
};

export const buyItem = async (itemId: string): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(
      `${API_URL}/shop/buy`,
      { itemId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to buy item';
  }
};

export const equipItem = async (itemId: string): Promise<UserProfile> => {
  try {
    const response = await axios.post<UserProfile>(
      `${API_URL}/shop/equip`,
      { itemId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to equip item';
  }
};

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axios.get<UserProfile>(`${API_URL}/user/profile`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch user profile';
  }
}