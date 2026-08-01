const TOKEN_KEY = 'quiz_access_token';
const GUEST_KEY = 'quiz_guest_session';

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface StoredGuest {
  guestSessionId: string;
  sessionToken: string;
  displayName: string;
}

export const authStorage = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  setGuest(guest: StoredGuest) {
    localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
  },
  getGuest(): StoredGuest | null {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clearGuest() {
    localStorage.removeItem(GUEST_KEY);
  },
};
