import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ensure this matches your backend URL

interface AuthResponse {
  token: string;
  user: { id: string; username: string; high_score: number; coins: number; };
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = (): { id: string; username: string; high_score: number; coins: number; } | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ensure this matches your backend URL

interface AuthResponse {
  token: string;
  user: { id: string; username: string; high_score: number; coins: number; };
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = (): { id: string; username: string; high_score: number; coins: number; } | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ensure this matches your backend URL

interface UserData {
  id: string;
  username: string;
  high_score: number;
  coins: number;
  current_character: string;
  owned_items: string[];
}

interface AuthResponse {
  token: string;
  user: UserData;
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
