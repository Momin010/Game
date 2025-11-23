import { create } from 'zustand';
import { getCurrentUser, getToken, logout as authLogout } from '../services/authService';

interface UserData {
  id: string;
  username: string;
  high_score: number;
  coins: number;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  setAuth: (token: string, user: UserData) => void;
  loadUser: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  user: getCurrentUser(),
  isAuthenticated: !!getToken(),
  loading: true, // Will be set to false after initial loadUser check

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, loading: false });
  },

  loadUser: () => {
    const token = getToken();
    const user = getCurrentUser();
    if (token && user) {
      set({ token, user, isAuthenticated: true, loading: false });
    } else {
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: () => {
    authLogout();
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },
}));

export default useAuthStore;
import { create } from 'zustand';
import { getCurrentUser, getToken, logout as authLogout } from '../services/authService';
import { getUserProfile } from '../services/apiService';

interface UserData {
  id: string;
  username: string;
  high_score: number;
  coins: number;
  current_character: string;
  owned_items: string[];
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  setAuth: (token: string, user: UserData) => void;
  loadUser: () => Promise<void>; // Make loadUser async
  logout: () => void;
  updateUserProfile: (profile: Partial<UserData>) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: getToken(),
  user: getCurrentUser(),
  isAuthenticated: !!getToken(),
  loading: true, // Will be set to false after initial loadUser check

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, loading: false });
  },

  loadUser: async () => {
    const token = getToken();
    const storedUser = getCurrentUser();
    if (token && storedUser) {
      // Attempt to fetch fresh user profile from backend
      try {
        const profile = await getUserProfile();
        const fullUserData: UserData = { ...storedUser, ...profile };
        set({ token, user: fullUserData, isAuthenticated: true, loading: false });
        localStorage.setItem('user', JSON.stringify(fullUserData)); // Update local storage with fresh data
      } catch (error) {
        console.error('Failed to load user profile from backend, using stored data:', error);
        // Fallback to stored data if backend fetch fails, but log out if token is invalid
        set({ token, user: storedUser, isAuthenticated: true, loading: false });
        // If there's an actual auth error, logout
        // TODO: More robust error checking (e.g., 401 status for token expiration)
        if (String(error).includes('401')) { // Basic check, better would be to check error.response.status
            get().logout();
        }
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: () => {
    authLogout();
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },

  updateUserProfile: (profile) => {
    set(state => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  }
}));

export default useAuthStore;
