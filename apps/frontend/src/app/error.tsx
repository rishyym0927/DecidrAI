/**
 * Global Error Page
 * Catches errors at the app level
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="text-[var(--muted)] mb-8">
          We encountered an unexpected error. Don't worry, our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors text-center"
          >
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-[var(--muted)]">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
