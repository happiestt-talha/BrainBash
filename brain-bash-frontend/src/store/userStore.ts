import { create } from 'zustand';
import { StoredUser, StoredGuest, authStorage } from '@/lib/auth-storage';

interface UserState {
  user: StoredUser | null;
  guest: StoredGuest | null;
  isLoading: boolean;
  setUser: (user: StoredUser, token: string) => void;
  setGuest: (guest: StoredGuest) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  guest: null,
  isLoading: true,

  setUser: (user, token) => {
    authStorage.setToken(token);
    set({ user, guest: null, isLoading: false });
  },

  setGuest: (guest) => {
    authStorage.setGuest(guest);
    set({ guest, isLoading: false });
  },

  logout: () => {
    authStorage.clearToken();
    authStorage.clearGuest();
    set({ user: null, guest: null, isLoading: false });
  },

  hydrate: () => {
    const guest = authStorage.getGuest();
    // real user hydration happens via a /auth/me call in useAuth — this just
    // handles the synchronous guest case since it's already fully in localStorage
    set({ guest, isLoading: !!authStorage.getToken() });
  },
}));