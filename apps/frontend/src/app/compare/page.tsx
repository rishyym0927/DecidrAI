/**
 * Tool Comparison Page
 * Side-by-side comparison of multiple AI tools
 */

'use client';

import { useState } from 'react';
import { useCompareTools, usePopularComparisons } from '@/hooks';

export default function ComparePage() {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { data: comparison, isLoading } = useCompareTools(selectedTools);
  const { data: popular } = usePopularComparisons();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Compare AI Tools</h1>

      {/* Tool Selector */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Select Tools to Compare</h2>
        <div className="flex gap-4 mb-4">
          {/* Tool search/select inputs */}
          {/* Max 3-4 tools */}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Selected tools chips */}
        </div>
      </div>

      {/* Popular Comparisons */}
      {!selectedTools.length && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Map popular comparisons */}
            {/* e.g., "ChatGPT vs Claude" */}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedTools.length >= 2 && (
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8">Generating comparison...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-4">Feature</th>
                  {/* Tool columns */}
                </tr>
              </thead>
              <tbody>
                {/* Comparison rows */}
                {/* - Pricing */}
                {/* - Features */}
                {/* - Use Cases */}
                {/* - Pros/Cons */}
                {/* - Performance */}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* AI-Generated Summary */}
      {comparison && (
        <div className="mt-8 bg-white dark:bg-black border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">AI Summary</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {/* AI-generated comparison summary */}
          </p>
        </div>
      )}
    </div>
  );
}
