'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMatchState } from '@/store/useMatchState';
import { useMatchStore } from '@/store/matchStore';
import { QuestionCard } from '@/components/match/QuestionCard';
import { LiveScoreboard } from '@/components/match/LiveScoreboard';

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  useMatchState(); // subscribes to socket events for the lifetime of this page

  const matchEnded = useMatchStore((s) => s.matchEnded);

  useEffect(() => {
    if (matchEnded) {
      router.push(`/leaderboard/${params.matchId}`);
    }
  }, [matchEnded]);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_280px]">
        <QuestionCard />
        <LiveScoreboard />
      </div>
    </div>
  );
}