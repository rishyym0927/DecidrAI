/**
 * Tools Directory Page
 * Browse all AI tools with filters and search
 */

'use client';

import { useState } from 'react';
import { useTools, useSearchTools } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import ToolsFilter from '@/components/tools/ToolsFilter';
import type { ToolFilters } from '@/types/tool';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ToolFilters>({
    limit: 12,
    page: 1,
  });

  // Use search if query exists, otherwise use regular tools fetch
  const shouldSearch = searchQuery.length > 2;
  const { data: searchData, isLoading: isSearching } = useSearchTools(
    searchQuery,
    shouldSearch
  );
  const { data: toolsData, isLoading: isLoadingTools } = useTools(
    shouldSearch ? undefined : filters
  );

  const data = shouldSearch ? searchData : toolsData;
  const isLoading = shouldSearch ? isSearching : isLoadingTools;

  const handleFilterChange = (newFilters: { category?: string; pricing?: string; sort?: string }) => {
    setFilters((prev) => ({ ...prev, ...newFilters as Partial<ToolFilters>, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Tools Directory
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            Discover and compare the best AI tools for your needs
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for AI tools..."
              className="w-full px-6 py-4 text-lg border-2 border-[var(--border)] rounded-2xl bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--foreground)] transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </div>
          </div>
        </form>

        {/* Filters (hide when searching) */}
        {!shouldSearch && (
          <ToolsFilter onFilterChange={handleFilterChange} />
        )}

        {/* Results Count */}
        {data?.data && (
          <div className="mb-6 text-[var(--muted)]">
            {shouldSearch ? (
              <p>
                Found <span className="font-semibold text-[var(--foreground)]">{data.data.tools?.length || 0}</span> results for "{searchQuery}"
              </p>
            ) : (
              <p>
                Showing <span className="font-semibold text-[var(--foreground)]">{data.data.tools?.length || 0}</span> of{' '}
                <span className="font-semibold text-[var(--foreground)]">{data.data.pagination?.total || 0}</span> tools
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-xl text-[var(--muted)]">Loading tools...</p>
          </div>
        )}

        {/* Tools Grid */}
        {!isLoading && data?.data?.tools && data.data.tools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.data.tools.map((tool: any) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.data?.tools || data.data.tools.length === 0) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No tools found</h3>
            <p className="text-[var(--muted)] mb-6">
              {shouldSearch
                ? 'Try adjusting your search query'
                : 'Try changing your filters'}
            </p>
            {shouldSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 border-2 border-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Pagination (only for non-search results) */}
        {!shouldSearch && data?.data?.pagination && data.data.pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
              disabled={(filters.page || 1) === 1}
              className="px-6 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--foreground)] transition-colors"
            >
              Previous
            </button>
            <span className="px-6 py-2 flex items-center text-[var(--muted)]">
              Page {filters.page || 1} of {data.data.pagination.pages}
            </span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
              disabled={(filters.page || 1) >= data.data.pagination.pages}
              className="px-6 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--foreground)] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
