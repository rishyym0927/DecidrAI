/**
 * Example component demonstrating the simplified architecture
 * Shows how to use React Query hooks and toast notifications
 */

'use client';

import { useTools, useSearchTools } from '@/hooks';
import { showToast } from '@/lib/toast';
import { useState } from 'react';

export default function ToolsExample() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all tools with React Query
  const { data: tools, isLoading, error } = useTools({ limit: 10 });

  // Search tools (only runs when query is not empty)
  const { data: searchResults, isLoading: isSearching } = useSearchTools(
    searchQuery,
    searchQuery.length > 2
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) {
      showToast.error('Please enter at least 3 characters');
      return;
    }
    showToast.success('Searching for tools...');
  };

  if (isLoading) {
    return <div className="p-8">Loading tools...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading tools</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tools Example</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {searchQuery ? 'Search Results' : 'All Tools'}
        </h2>

        {(searchQuery ? searchResults : tools)?.data?.tools?.map((tool: any) => (
          <div
            key={tool.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg">{tool.name}</h3>
            <p className="text-gray-600 mt-1">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
