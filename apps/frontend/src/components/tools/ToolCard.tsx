/**
 * Tool Card Component
 * Displays tool info matching actual backend data structure
 * Uses Next.js Image for optimized image loading
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
}

// Category to color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'productivity': 'bg-yellow-500',
  'writing': 'bg-blue-500',
  'marketing': 'bg-orange-500',
  'design': 'bg-purple-500',
  'creativity': 'bg-purple-500',
  'development': 'bg-green-500',
  'code': 'bg-green-500',
  'video': 'bg-red-500',
  'audio': 'bg-red-500',
  'collaboration': 'bg-cyan-500',
  'accessibility': 'bg-teal-500',
  'content-creation': 'bg-blue-500',
};

export default function ToolCard({ tool }: ToolCardProps) {
  const category = tool.categories?.[0] || 'other';
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500';

  const getPricingLabel = () => {
    switch (tool.pricing.model) {
      case 'free': return 'Free';
      case 'freemium': return 'Freemium';
      case 'paid': return tool.pricing.starting_price > 0 
        ? `From $${tool.pricing.starting_price}` 
        : 'Paid';
      default: return 'Contact';
    }
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
    >
      {/* Logo */}
      <div className={`inline-flex items-center justify-center w-14 h-14 ${categoryColor} rounded-xl mb-4 text-2xl overflow-hidden`}>
        {tool.logo_url ? (
          <Image 
            src={tool.logo_url} 
            alt={tool.name}
            width={40}
            height={40}
            className="object-contain"
            unoptimized={tool.logo_url.includes('data:')}
          />
        ) : (
          <span>🤖</span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold mb-2 group-hover:underline">
        {tool.name}
      </h3>

      {/* Tagline */}
      <p className="text-[var(--muted)] mb-4 line-clamp-2 leading-relaxed">
        {tool.tagline}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-3 py-1 bg-[var(--surface)] rounded-full text-xs font-medium capitalize">
          {category}
        </span>
        <span className="text-sm text-[var(--muted)]">
          {getPricingLabel()}
        </span>
      </div>

      {/* Tags */}
      {tool.problems_solved && tool.problems_solved.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tool.problems_solved.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-[var(--surface)] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
