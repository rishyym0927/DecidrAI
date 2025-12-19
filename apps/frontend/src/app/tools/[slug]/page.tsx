/**
 * Tool Detail Page
 * Individual tool page with full details, related tools, and comparison option
 */

'use client';

import { use } from 'react';
import { useTool, useRelatedTools } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import Link from 'next/link';

export default function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: toolData, isLoading, error } = useTool(slug);
  const { data: relatedData } = useRelatedTools(slug);

  const tool = toolData?.data;
  const relatedTools = relatedData?.data?.tools || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⚡</div>
          <p className="text-xl text-[var(--muted)]">Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-[var(--muted)] mb-6">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    );
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Content Creation': 'bg-blue-500',
      'Design & Art': 'bg-purple-500',
      'Development': 'bg-green-500',
      'Marketing': 'bg-orange-500',
      'Productivity': 'bg-yellow-500',
      'Video & Audio': 'bg-red-500',
      'Research': 'bg-indigo-500',
      'Customer Support': 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Logo and Name */}
            <div className="flex items-start gap-6 mb-6">
              <div className={`flex-shrink-0 w-20 h-20 ${getCategoryColor(tool.category)} rounded-2xl flex items-center justify-center text-4xl`}>
                {tool.logo || '🤖'}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {tool.name}
                </h1>
                <p className="text-xl text-[var(--muted)]">
                  {tool.tagline}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full font-medium">
                {tool.category}
              </span>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full">
                {tool.pricing.model === 'free' ? 'Free' : tool.pricing.model === 'freemium' ? 'Freemium' : 'Paid'}
              </span>
              {tool.rating && (
                <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                  {tool.reviewCount && (
                    <span className="text-[var(--muted)]">({tool.reviewCount})</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-3xl font-bold mb-4">About {tool.name}</h2>
                <p className="text-lg text-[var(--muted)] leading-relaxed">
                  {tool.description}
                </p>
              </section>

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 border border-[var(--border)] rounded-xl"
                      >
                        <span className="text-2xl">✓</span>
                        <span className="flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Tags</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--surface)]">
                <h3 className="text-xl font-bold mb-4">Get Started</h3>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-center hover:opacity-80 transition-opacity mb-3"
                >
                  Visit Website →
                </a>
                <Link
                  href={`/compare?tools=${tool.slug}`}
                  className="block w-full px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-center hover:bg-[var(--surface)] transition-colors"
                >
                  Compare Tool
                </Link>
              </div>

              {/* Pricing Info */}
              <div className="border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Model</span>
                    <span className="font-semibold capitalize">{tool.pricing.model}</span>
                  </div>
                  {tool.pricing.startingPrice && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Starting at</span>
                      <span className="font-semibold">
                        ${tool.pricing.startingPrice}/{tool.pricing.currency || 'month'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Similar Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.slice(0, 3).map((relatedTool: any) => (
                  <ToolCard key={relatedTool._id} tool={relatedTool} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
