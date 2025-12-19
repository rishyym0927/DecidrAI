/**
 * Category Detail Page
 * Shows tools in a specific category
 */

'use client';

import { use } from 'react';
import { useTools } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import Link from 'next/link';
import type { Tool } from '@/types/tool';

// Category metadata
const categoryMeta: Record<string, { name: string; icon: string; color: string; description: string }> = {
  productivity: {
    name: 'Productivity',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Tools to automate, organize, and optimize your workflows',
  },
  writing: {
    name: 'Writing',
    icon: '✍️',
    color: 'bg-blue-500',
    description: 'AI-powered content creation, editing, and copywriting tools',
  },
  development: {
    name: 'Development',
    icon: '💻',
    color: 'bg-green-500',
    description: 'Code generation, debugging, and pair programming assistants',
  },
  marketing: {
    name: 'Marketing',
    icon: '📈',
    color: 'bg-orange-500',
    description: 'SEO, advertising, social media, and analytics tools',
  },
  design: {
    name: 'Design',
    icon: '🎨',
    color: 'bg-purple-500',
    description: 'Image generation, UI design, and creative tools',
  },
  video: {
    name: 'Video & Audio',
    icon: '🎬',
    color: 'bg-red-500',
    description: 'Video editing, voice synthesis, and music generation',
  },
  research: {
    name: 'Research',
    icon: '🔬',
    color: 'bg-cyan-500',
    description: 'Knowledge discovery, summarization, and analysis',
  },
  collaboration: {
    name: 'Collaboration',
    icon: '👥',
    color: 'bg-indigo-500',
    description: 'Team communication, project management, and brainstorming',
  },
  support: {
    name: 'Customer Support',
    icon: '💬',
    color: 'bg-teal-500',
    description: 'Chatbots, help desks, and customer service automation',
  },
};

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: response, isLoading } = useTools({ category: slug, limit: 20 });
  
  const tools = response?.data?.tools || [];
  const pagination = response?.data?.pagination;
  const category = categoryMeta[slug];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-[var(--muted)] mb-6">
            This category doesn't exist.
          </p>
          <Link
            href="/categories"
            className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-xl text-3xl`}>
              {category.icon}
            </div>
            <div>
              <Link href="/categories" className="text-sm text-[var(--muted)] hover:underline mb-1 block">
                ← All Categories
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        {pagination && (
          <div className="mb-6 text-[var(--muted)]">
            <p>
              <span className="font-semibold text-[var(--foreground)]">{pagination.total}</span> tools in {category.name}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-xl text-[var(--muted)]">Loading tools...</p>
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

        {/* Empty State */}
        {!isLoading && tools.length === 0 && (
          <div className="text-center py-20 border border-[var(--border)] rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No tools found</h3>
            <p className="text-[var(--muted)] mb-6">
              We don't have tools in this category yet.
            </p>
            <Link
              href="/tools"
              className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              Browse All Tools
            </Link>
          </div>
        )}

        {/* Related Categories */}
        <section className="mt-16 pt-12 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6">Explore Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(categoryMeta)
              .filter(([key]) => key !== slug)
              .slice(0, 5)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/categories/${key}`}
                  className="px-4 py-2 border border-[var(--border)] rounded-full hover:border-[var(--foreground)] transition-colors"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
