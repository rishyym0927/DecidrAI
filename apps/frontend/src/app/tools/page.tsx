/**
 * Tools Listing Page
 * Browse all AI tools with filters and search
 */

'use client';

import { useTools } from '@/hooks';

export default function ToolsPage() {
  const { data, isLoading, error } = useTools();

  if (isLoading) return <div className="p-8">Loading tools...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading tools</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Tools Directory</h1>

      {/* Filters Section */}
      <div className="mb-8">
        {/* Add filters: category, pricing, features */}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        {/* Add search input */}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through tools */}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        {/* Add pagination controls */}
      </div>
    </div>
  );
}
