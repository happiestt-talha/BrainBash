'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MatchResultCard } from '@/components/leaderboard/MatchResultCard';
import { useMatchStore } from '@/store/matchStore';

interface ResultEntry {
  rank: number;
  score: number;
  displayName: string;
  team: 'A' | 'B' | null;
}

export default function MatchLeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const resetMatch = useMatchStore((s) => s.reset);

  useEffect(() => {
    api.getMatchLeaderboard(params.matchId as string).then((data: any) => {
      setResults(data);
      setLoading(false);
    });
  }, [params.matchId]);

  function handlePlayAgain() {
    resetMatch();
    router.push('/room/create');
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">Loading results...</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 px-4 py-8">
      <h1 className="text-center text-2xl font-bold">Match Results</h1>
      {results.map((entry) => (
        <MatchResultCard key={entry.rank} entry={entry} />
      ))}
      <button
        onClick={handlePlayAgain}
        className="mt-4 rounded-lg bg-black px-4 py-3 font-medium text-white"
      >
        Play again
      </button>
    </div>
  );
}