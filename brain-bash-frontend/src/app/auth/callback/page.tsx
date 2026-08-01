'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStorage } from '@/lib/auth-storage';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api';

// This is where the backend's googleCallback redirects to, with ?token=...
// It stores the token, then bounces to the homepage.
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/login?error=google_auth_failed');
      return;
    }

    authStorage.setToken(token);
    
    api.getMe()
      .then((user: any) => {
        setUser(user, token);
        router.push('/');
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        authStorage.clearToken();
        router.push('/login?error=fetch_user_failed');
      });
  }, [searchParams, router, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}