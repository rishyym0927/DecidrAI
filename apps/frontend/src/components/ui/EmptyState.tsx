/**
 * EmptyState Component
 * Reusable empty state for lists
 */

import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
