/**
 * Discover Page
 * Browse all discovery flows
 */

'use client';

import { useState } from 'react';
import { useFlows } from '@/hooks';
import FlowCard from '@/components/discover/FlowCard';
import type { FlowSummary } from '@/types/flow';

export default function DiscoverPage() {
  const [category, setCategory] = useState<string>('');
  
  const { data: response, isLoading } = useFlows({
    limit: 12,
    category: category || undefined,
    sort: 'popular',
  });

  const flows = response?.data?.flows || [];
  const pagination = response?.data?.pagination;

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'career', label: 'Career' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'automation', label: 'Automation' },
    { value: 'development', label: 'Development' },
    { value: 'learning', label: 'Learning' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Perfect AI Tool
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            Answer a few questions and get personalized AI tool recommendations
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                category === cat.value
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="mb-6 text-[var(--muted)]">
            <p>
              Showing <span className="font-semibold text-[var(--foreground)]">{flows.length}</span> discovery flows
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-xl text-[var(--muted)]">Loading flows...</p>
          </div>
        )}

        {/* Flows Grid */}
        {!isLoading && flows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow: FlowSummary) => (
              <FlowCard key={flow._id} flow={flow} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && flows.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No flows found</h3>
            <p className="text-[var(--muted)] mb-6">
              Try selecting a different category
            </p>
            <button
              onClick={() => setCategory('')}
              className="px-6 py-2 border-2 border-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
            >
              View All Flows
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
