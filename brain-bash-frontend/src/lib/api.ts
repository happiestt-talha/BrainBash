import { authStorage } from './auth-storage';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error: any) {
    toast.error('Unable to connect to the server. Please try again later.');
    throw new Error('Network error: Unable to connect to the server.');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    toast.error(error.message || 'An error occurred during the request.');
    throw new Error(error.message ?? 'Request failed');
  }

  return res.json();
}

export const api = {
  signup: (email: string, password: string, displayName: string) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }),

  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  createGuest: (displayName: string) =>
    request('/auth/guest', { method: 'POST', body: JSON.stringify({ displayName }) }),

  createRoom: (categoryId: string, difficulty: string, hostDisplayName: string) =>
    request('/rooms', { method: 'POST', body: JSON.stringify({ categoryId, difficulty, hostDisplayName }) }),

  getRoomByCode: (code: string) => request(`/rooms/${code}`),

  getMatchLeaderboard: (matchId: string) => request(`/leaderboard/match/${matchId}`),

  googleLoginUrl: () => `${API_URL}/auth/google`,

  getMe: () => request('/auth/me'),

  getCategories: () => request('/questions/categories'),
};