/**
 * Flow Results Page
 * Shows personalized tool recommendations based on flow completion
 */

'use client';

import { useRecommendationsBySession } from '@/hooks';
import Link from 'next/link';

export default function FlowResultsPage({
  params,
}: {
  params: { slug: string; sessionId: string };
}) {
  const { data: recommendations, isLoading, error } = useRecommendationsBySession(
    params.sessionId
  );

  if (isLoading) return <div className="p-8">Generating recommendations...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading recommendations</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Personalized Recommendations</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Based on your answers, here are the best AI tools for you
        </p>
      </div>

      {/* Extracted Tags/Intent */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">We understood you need:</h2>
        <div className="flex flex-wrap gap-2">
          {/* Map extracted tags */}
        </div>
      </div>

      {/* Recommended Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Recommendations</h2>
        <div className="space-y-6">
          {/* Map through recommended tools */}
          {/* Show: rank, tool card, match score, why recommended */}
        </div>
      </div>

      {/* Alternative Tools */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Other Options to Consider</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map alternative tools */}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-x-4">
        <Link
          href="/discover"
          className="inline-block px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          Try Another Flow
        </Link>
        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80">
          Save Results
        </button>
      </div>
    </div>
  );
}
