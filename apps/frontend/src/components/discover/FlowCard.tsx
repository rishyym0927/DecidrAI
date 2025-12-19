/**
 * Flow Card Component
 * Displays discovery flow info
 */

import Link from 'next/link';
import type { FlowSummary } from '@/types/flow';

interface FlowCardProps {
  flow: FlowSummary;
}

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'career': 'bg-blue-500',
  'productivity': 'bg-yellow-500',
  'automation': 'bg-purple-500',
  'development': 'bg-green-500',
  'learning': 'bg-orange-500',
  'marketing': 'bg-pink-500',
  'design': 'bg-indigo-500',
};

export default function FlowCard({ flow }: FlowCardProps) {
  const categoryColor = CATEGORY_COLORS[flow.category] || 'bg-gray-500';

  return (
    <Link
      href={`/discover/${flow.slug}`}
      className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 ${categoryColor} rounded-xl mb-4 text-3xl`}>
        {flow.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2 group-hover:underline">
        {flow.title}
      </h3>

      {/* Description */}
      <p className="text-[var(--muted)] mb-4 line-clamp-2 leading-relaxed">
        {flow.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{flow.estimatedTimeMinutes} min</span>
        </div>
        {flow.completionRate > 0 && (
          <div className="flex items-center gap-1">
            <span>✅</span>
            <span>{flow.completionRate}% completion</span>
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className="mt-4">
        <span className="inline-block px-3 py-1 bg-[var(--surface)] rounded-full text-xs font-medium capitalize">
          {flow.category}
        </span>
      </div>
    </Link>
  );
}
