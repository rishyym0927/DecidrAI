/**
 * Tool Card Component
 * Displays tool info matching actual backend data structure
 * Uses Next.js Image for optimized image loading
 * Includes save/bookmark functionality
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Tool } from '@/types/tool';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@clerk/nextjs';
import { useSaveTool, useUnsaveTool, useSavedTools } from '@/hooks';
import { Heart } from 'lucide-react';
import { showToast } from '@/lib/toast';

interface ToolCardProps {
  tool: Tool;
  source?: string;
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

export default function ToolCard({ tool, source = 'list' }: ToolCardProps) {
  const { isSignedIn } = useAuth();
  const category = tool.categories?.[0] || 'other';
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500';

  // Save functionality
  const { data: savedToolsData } = useSavedTools();
  const saveMutation = useSaveTool();
  const unsaveMutation = useUnsaveTool();
  
  const isSaved = savedToolsData?.data?.some(
    (saved: any) => saved.toolId === tool._id || saved.toolId?._id === tool._id
  ) ?? false;

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

  const handleClick = () => {
    analytics.toolClicked(tool.slug, source);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      showToast.error('Please sign in to save tools');
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate(tool._id, {
        onSuccess: () => showToast.success('Removed from saved'),
        onError: () => showToast.error('Failed to remove'),
      });
    } else {
      saveMutation.mutate({ toolId: tool._id }, {
        onSuccess: () => showToast.success('Tool saved!'),
        onError: () => showToast.error('Failed to save'),
      });
    }
  };

  return (
    <div className="relative group">
      {/* Save Button */}
      <button
        onClick={handleSaveClick}
        disabled={saveMutation.isPending || unsaveMutation.isPending}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          isSaved 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-red-500'
        } opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50`}
        aria-label={isSaved ? 'Unsave tool' : 'Save tool'}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      <Link
        href={`/tools/${tool.slug}`}
        onClick={handleClick}
        className="block border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
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
    </div>
  );
}
