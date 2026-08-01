'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth-storage';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const router = useRouter();
  const { user, guest, isLoading, setUser, setGuest, logout, hydrate } = useUserStore();

  useEffect(() => {
    hydrate();
  }, []);

  async function loginWithPassword(email: string, password: string) {
    const result: any = await api.login(email, password);
    setUser(result.user, result.accessToken);
  }

  async function signup(email: string, password: string, displayName: string) {
    const result: any = await api.signup(email, password, displayName);
    setUser(result.user, result.accessToken);
  }

  async function joinAsGuest(displayName: string) {
    const result: any = await api.createGuest(displayName);
    setGuest(result);
  }

  function loginWithGoogle() {
    window.location.href = api.googleLoginUrl();
  }

  return {
    user,
    guest,
    isLoading,
    isAuthenticated: !!user,
    isGuest: !!guest && !user,
    loginWithPassword,
    signup,
    joinAsGuest,
    loginWithGoogle,
    logout,
  };
}