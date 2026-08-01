'use client';

import { useState } from 'react';

export function RoomCodeDisplay({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/room/${code}/lobby` : '';

  function handleCopy() {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500">Room code</p>
      <p className="text-4xl font-bold tracking-widest">{code}</p>
      <button
        onClick={handleCopy}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        {copied ? 'Link copied!' : 'Copy invite link'}
      </button>
    </div>
  );
}