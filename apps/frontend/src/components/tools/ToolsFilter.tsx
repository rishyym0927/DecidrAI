/**
 * Tools Filter Component
 * Filters for category, pricing, and sorting
 */

'use client';

import { useState } from 'react';

interface ToolsFilterProps {
  onFilterChange: (filters: {
    category?: string;
    pricing?: string;
    sort?: string;
  }) => void;
}

export default function ToolsFilter({ onFilterChange }: ToolsFilterProps) {
  const [category, setCategory] = useState('');
  const [pricing, setPricing] = useState('');
  const [sort, setSort] = useState('popular');

  const categories = [
    'All Categories',
    'Content Creation',
    'Design & Art',
    'Development',
    'Marketing',
    'Productivity',
    'Video & Audio',
    'Research',
    'Customer Support',
  ];

  const pricingOptions = [
    'All Pricing',
    'Free',
    'Freemium',
    'Paid',
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'All Categories' ? '' : value;
    setCategory(newCategory);
    onFilterChange({ category: newCategory, pricing, sort });
  };

  const handlePricingChange = (value: string) => {
    const newPricing = value === 'All Pricing' ? '' : value;
    setPricing(newPricing);
    onFilterChange({ category, pricing: newPricing, sort });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    onFilterChange({ category, pricing, sort: value });
  };

  return (
    <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--background)] mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={category || 'All Categories'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Pricing</label>
          <select
            value={pricing || 'All Pricing'}
            onChange={(e) => handlePricingChange(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {pricingOptions.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sort By</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
