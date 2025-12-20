/**
 * Loading Component
 * Standardized loading state with skeleton loaders
 */

interface LoadingProps {
  /** Loading message to display */
  message?: string;
  /** Show skeleton cards instead of spinner */
  skeleton?: boolean;
  /** Number of skeleton items (if skeleton is true) */
  count?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({
  message = 'Loading...',
  skeleton = false,
  count = 6,
  size = 'md',
}: LoadingProps) {
  if (skeleton) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="border border-[var(--border)] rounded-2xl p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-[var(--border)] rounded-xl mb-4" />
            <div className="h-6 bg-[var(--border)] rounded w-3/4 mb-2" />
            <div className="h-4 bg-[var(--border)] rounded w-full mb-3" />
            <div className="h-6 bg-[var(--border)] rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const spinnerSize = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className="text-center py-20">
      <div className={`inline-block mb-4`}>
        <svg
          className={`animate-spin ${spinnerSize} text-[var(--foreground)]`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className={`${textSize} text-[var(--muted)]`}>{message}</p>
    </div>
  );
}

/**
 * Inline loading spinner for buttons/small areas
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
