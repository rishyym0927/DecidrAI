/**
 * Discovery Flows Listing Page
 * Browse all available discovery flows
 */

'use client';

import { useFlows } from '@/hooks';

export default function DiscoverPage() {
  const { data: flows, isLoading, error } = useFlows();

  if (isLoading) return <div className="p-8">Loading flows...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading flows</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Discover Your Perfect AI Tool</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Answer a few questions to get personalized recommendations
      </p>

      {/* Featured Flow */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Discovery Paths</h2>
        {/* Highlight most popular flow */}
      </div>

      {/* All Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through flows */}
        {/* Each flow card shows: title, description, estimated time, question count */}
      </div>
    </div>
  );
}
