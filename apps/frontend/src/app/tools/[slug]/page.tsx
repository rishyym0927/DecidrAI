/**
 * Tool Detail Page
 * Individual tool page with full details
 */

'use client';

import { use } from 'react';
import { useTool, useRelatedTools } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import Link from 'next/link';
import type { Tool } from '@/types/tool';

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'productivity': 'bg-yellow-500',
  'writing': 'bg-blue-500',
  'marketing': 'bg-orange-500',
  'design': 'bg-purple-500',
  'creativity': 'bg-purple-500',
  'video': 'bg-red-500',
  'audio': 'bg-red-500',
  'collaboration': 'bg-cyan-500',
};

export default function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: toolResponse, isLoading, error } = useTool(slug);
  const { data: relatedResponse } = useRelatedTools(slug);

  const tool = toolResponse?.data;
  const relatedTools = relatedResponse?.data || [];

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

  const category = tool.categories?.[0] || 'other';
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Logo and Name */}
            <div className="flex items-start gap-6 mb-6">
              <div className={`flex-shrink-0 w-20 h-20 ${categoryColor} rounded-2xl flex items-center justify-center text-4xl overflow-hidden`}>
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name}
                    className="w-16 h-16 object-contain"
                  />
                ) : '🤖'}
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
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full font-medium capitalize">
                {category}
              </span>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full capitalize">
                {tool.pricing.model}
                {tool.pricing.starting_price > 0 && ` - From $${tool.pricing.starting_price}`}
              </span>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full">
                👁️ {tool.view_count} views
              </span>
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
                  {tool.long_description || tool.description}
                </p>
              </section>

              {/* Use Cases */}
              {tool.use_cases && tool.use_cases.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Use Cases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.use_cases.map((useCase: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 border border-[var(--border)] rounded-xl"
                      >
                        <span className="text-2xl text-green-500">✓</span>
                        <span className="flex-1">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Best For */}
              {tool.best_for && tool.best_for.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Best For</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.best_for.map((item: string) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                      >
                        👤 {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Not Good For */}
              {tool.not_good_for && tool.not_good_for.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Limitations</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.not_good_for.map((item: string) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full"
                      >
                        ⚠️ {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Integrations */}
              {tool.integrations && tool.integrations.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Integrations</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.integrations.map((integration: string) => (
                      <span
                        key={integration}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm"
                      >
                        🔗 {integration}
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
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-center hover:opacity-80 transition-opacity mb-3"
                >
                  Visit Website →
                </a>
                <Link
                  href={`/compare?tools=${tool.slug}`}
                  className="block w-full px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-center hover:bg-[var(--background)] transition-colors"
                >
                  Compare Tool
                </Link>
              </div>

              {/* Pricing Info */}
              <div className="border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Pricing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Model</span>
                    <span className="font-semibold capitalize">{tool.pricing.model}</span>
                  </div>
                  {tool.pricing.starting_price > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Starting at</span>
                      <span className="font-semibold">${tool.pricing.starting_price}/mo</span>
                    </div>
                  )}
                  {tool.pricing.tiers && tool.pricing.tiers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <p className="text-sm text-[var(--muted)] mb-2">Available Plans:</p>
                      {tool.pricing.tiers.map((tier) => (
                        <div key={tier.name} className="flex justify-between text-sm py-1">
                          <span>{tier.name}</span>
                          <span>${tier.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Learning Curve</span>
                    <span className="capitalize">{tool.learning_curve}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Has API</span>
                    <span>{tool.has_api ? '✓ Yes' : '✗ No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Platforms</span>
                    <span>{tool.platforms?.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Similar Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.slice(0, 3).map((relatedTool: Tool) => (
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
