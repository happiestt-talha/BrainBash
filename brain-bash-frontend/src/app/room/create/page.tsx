'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useAuth } from '@/hooks/useAuth';

import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function CreateRoomPage() {
  const router = useRouter();
  const { createRoom } = useRoom();
  const { user, guest } = useAuth();

  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const hostName = user?.displayName ?? guest?.displayName ?? '';

  useEffect(() => {
    async function loadCategories() {
      try {
        const data: any = await api.getCategories();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  async function handleCreate() {
    setLoading(true);
    try {
      const room: any = await createRoom(categoryId, difficulty, hostName);
      router.push(`/room/${room.code}/lobby`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">Create a room</h1>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
          disabled={loadingCategories}
        >
          {loadingCategories ? (
            <option>Loading...</option>
          ) : (
            categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading || !hostName}
        className="rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create room'}
      </button>
    </div>
  );
}