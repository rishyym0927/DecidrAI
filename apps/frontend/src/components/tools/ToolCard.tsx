/**
 * Tool Card Component
 * Reusable card for displaying tool information
 */

import Link from 'next/link';
import type { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  // Generate a color based on category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Content Creation': 'bg-blue-500',
      'Design & Art': 'bg-purple-500',
      'Development': 'bg-green-500',
      'Marketing': 'bg-orange-500',
      'Productivity': 'bg-yellow-500',
      'Video & Audio': 'bg-red-500',
      'Research': 'bg-indigo-500',
      'Customer Support': 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  // Format pricing display
  const getPricingDisplay = () => {
    if (tool.pricing.model === 'free') return 'Free';
    if (tool.pricing.model === 'freemium') return 'Freemium';
    if (tool.pricing.startingPrice) {
      return `From $${tool.pricing.startingPrice}`;
    }
    return 'Paid';
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
    >
      {/* Logo/Icon */}
      <div className={`inline-flex items-center justify-center w-14 h-14 ${getCategoryColor(tool.category)} rounded-xl mb-4 text-2xl`}>
        {tool.logo || '🤖'}
      </div>

      {/* Tool Name */}
      <h3 className="text-xl font-bold mb-2 group-hover:underline">
        {tool.name}
      </h3>

      {/* Tagline */}
      <p className="text-[var(--muted)] mb-4 line-clamp-2 leading-relaxed">
        {tool.tagline}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mb-3">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-[var(--surface)] rounded-full text-xs font-medium">
          {tool.category}
        </span>

        {/* Pricing */}
        <span className="text-sm text-[var(--muted)]">
          {getPricingDisplay()}
        </span>
      </div>

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-[var(--surface)] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Rating (if available) */}
      {tool.rating && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-yellow-500">⭐</span>
          <span className="font-semibold">{tool.rating.toFixed(1)}</span>
          {tool.reviewCount && (
            <span className="text-[var(--muted)]">({tool.reviewCount})</span>
          )}
        </div>
      )}
    </Link>
  );
}
