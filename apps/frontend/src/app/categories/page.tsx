/**
 * Categories Page
 * Browse all tool categories
 */

import Link from 'next/link';

// Category data
const categories = [
  {
    name: 'Productivity',
    slug: 'productivity',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Automation, organization, and workflow optimization tools',
    examples: ['Notion AI', 'Todoist AI', 'Zapier'],
  },
  {
    name: 'Writing',
    slug: 'writing',
    icon: '✍️',
    color: 'bg-blue-500',
    description: 'Content creation, copywriting, editing, and grammar tools',
    examples: ['Jasper', 'Grammarly', 'Copy.ai'],
  },
  {
    name: 'Development',
    slug: 'development',
    icon: '💻',
    color: 'bg-green-500',
    description: 'Code generation, debugging, and pair programming assistants',
    examples: ['GitHub Copilot', 'Tabnine', 'Cursor'],
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    icon: '📈',
    color: 'bg-orange-500',
    description: 'SEO, advertising, social media, and analytics tools',
    examples: ['Jasper', 'Surfer SEO', 'AdCreative.ai'],
  },
  {
    name: 'Design',
    slug: 'design',
    icon: '🎨',
    color: 'bg-purple-500',
    description: 'Image generation, UI design, and creative tools',
    examples: ['Midjourney', 'DALL-E', 'Canva AI'],
  },
  {
    name: 'Video & Audio',
    slug: 'video',
    icon: '🎬',
    color: 'bg-red-500',
    description: 'Video editing, voice synthesis, and music generation',
    examples: ['Runway ML', 'ElevenLabs', 'Descript'],
  },
  {
    name: 'Research',
    slug: 'research',
    icon: '🔬',
    color: 'bg-cyan-500',
    description: 'Knowledge discovery, summarization, and analysis',
    examples: ['Perplexity', 'Elicit', 'Consensus'],
  },
  {
    name: 'Collaboration',
    slug: 'collaboration',
    icon: '👥',
    color: 'bg-indigo-500',
    description: 'Team communication, project management, and brainstorming',
    examples: ['Notion AI', 'Miro AI', 'Slack AI'],
  },
  {
    name: 'Customer Support',
    slug: 'support',
    icon: '💬',
    color: 'bg-teal-500',
    description: 'Chatbots, help desks, and customer service automation',
    examples: ['Intercom', 'Zendesk AI', 'ChatGPT'],
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse by Category
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            Explore AI tools organized by what you need to accomplish
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-xl mb-4 text-3xl`}>
                {category.icon}
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold mb-2 group-hover:underline">
                {category.name}
              </h2>

              {/* Description */}
              <p className="text-[var(--muted)] mb-4 leading-relaxed">
                {category.description}
              </p>

              {/* Examples */}
              <div className="text-sm text-[var(--muted)]">
                <span className="font-medium">Popular:</span>{' '}
                {category.examples.join(', ')}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-12 border-t border-[var(--border)]">
          <h3 className="text-2xl font-bold mb-4">Can't find what you need?</h3>
          <p className="text-[var(--muted)] mb-6">
            Let us help you discover the perfect AI tool
          </p>
          <Link
            href="/discover"
            className="inline-block px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Start Discovery Flow
          </Link>
        </div>
      </div>
    </div>
  );
}
