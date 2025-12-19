/**
 * Featured Tools Section
 * Fetches and displays popular AI tools from API
 */

'use client';

import Link from 'next/link';
import { useTools } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';

export default function FeaturedToolsSection() {
  const { data: response, isLoading } = useTools({ limit: 6, sort: 'popular' });
  const tools = response?.data?.tools || [];

  return (
    <section className="py-20 md:py-32 bg-[var(--surface)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Popular AI Tools
            </h2>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Discover the most loved tools by our community
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-[var(--border)] rounded-2xl p-6 animate-pulse">
                  <div className="w-14 h-14 bg-[var(--border)] rounded-xl mb-4"></div>
                  <div className="h-6 bg-[var(--border)] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[var(--border)] rounded w-full mb-3"></div>
                  <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* Tools Grid */}
          {!isLoading && tools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool: Tool) => (
                <ToolCard key={tool._id} tool={tool} />
              ))}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-block px-8 py-4 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-lg hover:bg-[var(--surface)] transition-colors"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
