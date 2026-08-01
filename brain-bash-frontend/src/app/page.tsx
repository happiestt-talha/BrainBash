'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, guest, isAuthenticated, isGuest, logout } = useAuth();

  const [joinCode, setJoinCode] = useState('');

  const displayName = user?.displayName ?? guest?.displayName;

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (joinCode.length !== 6) return;
    router.push(`/room/${joinCode.toUpperCase()}/lobby`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">BrainBash</h1>
        <p className="mt-2 text-gray-500">Real-time trivia with friends</p>
      </div>

      {displayName ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-gray-500">
            Playing as <span className="font-medium text-black">{displayName}</span>
          </p>

          <button
            onClick={() => router.push('/room/create')}
            className="rounded-lg bg-black px-4 py-3 font-medium text-white"
          >
            Create a room
          </button>

          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="rounded-lg border border-gray-300 px-3 py-3 text-center text-lg tracking-widest"
            />
            <button
              type="submit"
              disabled={joinCode.length !== 6}
              className="rounded-lg border border-gray-300 px-4 py-3 font-medium disabled:opacity-50"
            >
              Join room
            </button>
          </form>

          {isAuthenticated && (
            <div className="flex justify-center gap-4 pt-4 text-sm">
              <a href="/friends" className="text-gray-500 underline">Friends</a>
              <a href="/leaderboard" className="text-gray-500 underline">Leaderboard</a>
              <button onClick={logout} className="text-gray-500 underline">Log out</button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="rounded-lg bg-black px-4 py-3 font-medium text-white"
        >
          Get started
        </button>
      )}
    </div>
  );
}