/**
 * Search Section Error Page
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Search error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold mb-4">Search Failed</h1>
        <p className="text-[var(--muted)] mb-8">
          We couldn't complete your search. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/tools"
            className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors text-center"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
