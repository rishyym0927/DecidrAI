/**
 * Featured Tools Section
 * Showcases popular AI tools with their logos
 */

import Link from 'next/link';

export default function FeaturedToolsSection() {
  const tools = [
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      tagline: 'Conversational AI assistant',
      category: 'Content Creation',
      logo: '🤖',
      color: 'bg-emerald-500',
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      tagline: 'AI image generation',
      category: 'Design & Art',
      logo: '🎨',
      color: 'bg-violet-500',
    },
    {
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      tagline: 'AI pair programmer',
      category: 'Development',
      logo: '💻',
      color: 'bg-blue-500',
    },
    {
      name: 'Jasper',
      slug: 'jasper',
      tagline: 'AI content platform',
      category: 'Marketing',
      logo: '✨',
      color: 'bg-purple-500',
    },
    {
      name: 'Notion AI',
      slug: 'notion-ai',
      tagline: 'AI-powered workspace',
      category: 'Productivity',
      logo: '📝',
      color: 'bg-gray-700',
    },
    {
      name: 'Runway',
      slug: 'runway',
      tagline: 'AI video editing',
      category: 'Video & Audio',
      logo: '🎬',
      color: 'bg-pink-500',
    },
  ];

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

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
              >
                {/* Logo */}
                <div className={`inline-flex items-center justify-center w-14 h-14 ${tool.color} rounded-xl mb-4 text-2xl`}>
                  {tool.logo}
                </div>

                {/* Tool Name */}
                <h3 className="text-xl font-bold mb-2 group-hover:underline">
                  {tool.name}
                </h3>

                {/* Tagline */}
                <p className="text-[var(--muted)] mb-3">
                  {tool.tagline}
                </p>

                {/* Category Badge */}
                <div className="inline-block px-3 py-1 bg-[var(--surface)] rounded-full text-xs font-medium">
                  {tool.category}
                </div>
              </Link>
            ))}
          </div>

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
