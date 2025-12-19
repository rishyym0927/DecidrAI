/**
 * Search Results Page
 * Global search across all tools
 */

'use client';

import { useState } from 'react';
import { useSearchTools } from '@/hooks';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data, isLoading } = useSearchTools(query, query.length > 2);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Search AI Tools</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tools..."
          className="w-full px-6 py-4 text-lg border rounded-lg"
          autoFocus
        />
      </div>

      {/* Results */}
      {isLoading && <div className="p-8">Searching...</div>}

      {query.length > 2 && !isLoading && (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {data?.data?.total || 0} results for "{query}"
          </p>

          <div className="space-y-6">
            {/* Map search results */}
            {/* Show: tool name, description, category, match score */}
          </div>
        </div>
      )}

      {query.length <= 2 && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          Enter at least 3 characters to search
        </div>
      )}
    </div>
  );
}
