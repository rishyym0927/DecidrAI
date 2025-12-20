/**
 * ServiceUnavailable Component
 * User-friendly error page when backend is down
 */

'use client';

interface ServiceUnavailableProps {
  onRetry?: () => void;
  message?: string;
}

export default function ServiceUnavailable({
  onRetry,
  message = 'Our servers are temporarily unavailable. Please try again in a few moments.',
}: ServiceUnavailableProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔧</div>
        <h2 className="text-2xl font-bold mb-4">Service Temporarily Unavailable</h2>
        <p className="text-[var(--muted)] mb-8">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
        )}
        <div className="mt-8 p-4 bg-[var(--surface)] rounded-xl">
          <p className="text-sm text-[var(--muted)]">
            <strong>What you can do:</strong>
          </p>
          <ul className="text-sm text-[var(--muted)] mt-2 text-left list-disc list-inside">
            <li>Check your internet connection</li>
            <li>Wait a moment and try again</li>
            <li>Refresh the page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
