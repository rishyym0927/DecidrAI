/**
 * Custom 404 Page
 * Shows when a page is not found
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center max-w-md px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--muted)]">
          Page Not Found
        </h2>
        <p className="text-[var(--muted)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/tools"
            className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
