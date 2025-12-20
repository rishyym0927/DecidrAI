/**
 * Tools Directory Page
 * Browse and search AI tools
 */

'use client';

import { useState } from 'react';
import { useTools, useSearchTools } from '@/hooks';
import { useDebounceWithPending } from '@/hooks/useDebounce';
import ToolCard from '@/components/tools/ToolCard';
import ToolsFilter from '@/components/tools/ToolsFilter';
import type { Tool, ToolFilters } from '@/types/tool';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ToolFilters>({
    limit: 12,
    page: 1,
    sort: 'newest',
  });

  // Debounce search query with 400ms delay
  const { debouncedValue: debouncedQuery, isPending: isDebouncing } = useDebounceWithPending(searchQuery, 400);

  // Determine if we should search (using debounced value)
  const isSearching = debouncedQuery.length >= 3;

  // Fetch tools list (always runs)
  const { 
    data: toolsResponse, 
    isLoading: isLoadingTools 
  } = useTools(filters);

  // Search tools (only runs when debounced query is 3+ chars)
  const { 
    data: searchResponse, 
    isLoading: isSearchingTools 
  } = useSearchTools(debouncedQuery, isSearching);

  // Determine which data to show - include debouncing state
  const isLoading = isDebouncing || (isSearching ? isSearchingTools : isLoadingTools);
  
  // Handle different response structures:
  // - List: { success, data: { tools: [], pagination: {} } }
  // - Search: { success, data: [] }
  let tools: Tool[] = [];
  let pagination = null;
  
  if (isSearching && searchResponse) {
    // Search response: data is array directly
    tools = Array.isArray(searchResponse.data) ? searchResponse.data : [];
  } else if (toolsResponse?.data) {
    // List response: data.tools is array
    tools = toolsResponse.data.tools || [];
    pagination = toolsResponse.data.pagination;
  }

  const handleFilterChange = (newFilters: Partial<ToolFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for AI tools... (type 3+ characters)"
              className="w-full px-6 py-4 text-lg border-2 border-[var(--border)] rounded-2xl bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--foreground)] transition-colors pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </div>
          </div>
        </div>

        {/* Filters (hide when searching) */}
        {!isSearching && (
          <ToolsFilter 
            onFilterChange={handleFilterChange} 
            currentFilters={filters}
          />
        )}

        {/* Results Count */}
        <div className="mb-6 text-[var(--muted)]">
          {isSearching ? (
            <p>
              Found <span className="font-semibold text-[var(--foreground)]">{tools.length}</span> results for "{searchQuery}"
            </p>
          ) : pagination ? (
            <p>
              Showing <span className="font-semibold text-[var(--foreground)]">{tools.length}</span> of{' '}
              <span className="font-semibold text-[var(--foreground)]">{pagination.total}</span> tools
            </p>
          ) : null}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-xl text-[var(--muted)]">Loading tools...</p>
          </div>
        )}

        {/* Tools Grid */}
        {!isLoading && tools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No tools found</h3>
            <p className="text-[var(--muted)] mb-6">
              {isSearching
                ? 'Try adjusting your search query'
                : 'Try changing your filters'}
            </p>
            {isSearching && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 border-2 border-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Pagination (only for non-search) */}
        {!isSearching && pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
              disabled={(filters.page || 1) === 1}
              className="px-6 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--foreground)] transition-colors"
            >
              Previous
            </button>
            <span className="px-6 py-2 flex items-center text-[var(--muted)]">
              Page {filters.page || 1} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={(filters.page || 1) >= pagination.pages}
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
