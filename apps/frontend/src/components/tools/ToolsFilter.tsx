/**
 * Tools Filter Component
 * Matches backend filter query params: category, price, learning_curve, sort
 */

'use client';

import type { ToolFilters } from '@/types/tool';

interface ToolsFilterProps {
  onFilterChange: (filters: Partial<ToolFilters>) => void;
  currentFilters: ToolFilters;
}

export default function ToolsFilter({ onFilterChange, currentFilters }: ToolsFilterProps) {
  // Categories from backend data
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'writing', label: 'Writing' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'collaboration', label: 'Collaboration' },
  ];

  // Pricing models from backend
  const pricingOptions = [
    { value: '', label: 'All Pricing' },
    { value: 'free', label: 'Free' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid', label: 'Paid' },
  ];

  // Sort options matching backend
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low' },
    { value: 'price-high', label: 'Price: High' },
  ];

  return (
    <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--background)] mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={currentFilters.category || ''}
            onChange={(e) => onFilterChange({ ...currentFilters, category: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Pricing</label>
          <select
            value={currentFilters.price || ''}
            onChange={(e) => onFilterChange({ ...currentFilters, price: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {pricingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sort By</label>
          <select
            value={currentFilters.sort || 'newest'}
            onChange={(e) => onFilterChange({ ...currentFilters, sort: e.target.value as ToolFilters['sort'] })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
