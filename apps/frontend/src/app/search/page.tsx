/**
 * Search Results Page
 * Global search across all tools
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchTools } from '@/hooks';
import { useDebounceWithPending } from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';
import { analytics } from '@/lib/analytics';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Debounce search query with 400ms delay
  const { debouncedValue: debouncedQuery, isPending: isDebouncing } = useDebounceWithPending(query, 400);

  const { data, isLoading: isSearching } = useSearchTools(debouncedQuery, debouncedQuery.length > 2);
  const results: Tool[] = Array.isArray(data?.data) ? data.data : [];
  
  // Combined loading state includes debouncing
  const isLoading = isDebouncing || isSearching;

  // Track search when results load
  useEffect(() => {
    if (debouncedQuery.length > 2 && !isSearching && results) {
      analytics.searchPerformed(debouncedQuery, results.length);
    }
  }, [debouncedQuery, isSearching, results]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Search AI Tools</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools..."
            className="w-full max-w-2xl px-6 py-4 text-lg border border-[var(--border)] rounded-full bg-[var(--background)]"
            autoFocus
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-[var(--border)] rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-[var(--border)] rounded-xl mb-4"></div>
                <div className="h-6 bg-[var(--border)] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[var(--border)] rounded w-full mb-3"></div>
                <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {query.length > 2 && !isLoading && (
          <>
            <p className="text-[var(--muted)] mb-6">
              <span className="font-semibold text-[var(--foreground)]">{results.length}</span> results for "{query}"
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No tools found</h3>
                <p className="text-[var(--muted)] mb-6">
                  Try different keywords or browse our categories
                </p>
                <Link
                  href="/tools"
                  className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
                >
                  Browse All Tools
                </Link>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {query.length <= 2 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-2">Start Searching</h3>
            <p className="text-[var(--muted)]">
              Enter at least 3 characters to search for AI tools
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

