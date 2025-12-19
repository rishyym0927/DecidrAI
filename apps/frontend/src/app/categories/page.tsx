/**
 * Categories Page
 * Browse tools by category
 */

'use client';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Explore AI tools organized by use case
      </p>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category cards */}
        {/* Each card: icon, name, description, tool count */}
        {/* Categories: */}
        {/* - Content Creation */}
        {/* - Design & Art */}
        {/* - Development */}
        {/* - Marketing */}
        {/* - Productivity */}
        {/* - Research */}
        {/* - Customer Support */}
        {/* - Data Analysis */}
        {/* - Video & Audio */}
        {/* - Writing */}
      </div>
    </div>
  );
}
