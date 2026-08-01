'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword, loginWithGoogle, joinAsGuest } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await loginWithPassword(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleGuestJoin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await joinAsGuest(guestName);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <button
        onClick={loginWithGoogle}
        className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        or
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
          required
        />
        <button type="submit" className="rounded-lg bg-black px-4 py-2 font-medium text-white">
          Log in
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        or play as guest
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleGuestJoin} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
          required
        />
        <button type="submit" className="rounded-lg border border-gray-300 px-4 py-2 font-medium">
          Continue as guest
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}