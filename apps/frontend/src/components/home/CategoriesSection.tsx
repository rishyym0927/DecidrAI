/**
 * Popular Categories Section
 * Shows main tool categories with colorful icons
 */

import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    {
      name: 'Content Creation',
      slug: 'content-creation',
      icon: '✍️',
      color: 'bg-blue-500',
      description: 'Writing, blogging, copywriting',
      count: 45,
    },
    {
      name: 'Design & Art',
      slug: 'design-art',
      icon: '🎨',
      color: 'bg-purple-500',
      description: 'Image generation, design tools',
      count: 38,
    },
    {
      name: 'Development',
      slug: 'development',
      icon: '💻',
      color: 'bg-green-500',
      description: 'Code generation, debugging',
      count: 52,
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      icon: '📈',
      color: 'bg-orange-500',
      description: 'SEO, ads, social media',
      count: 34,
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      icon: '⚡',
      color: 'bg-yellow-500',
      description: 'Automation, organization',
      count: 41,
    },
    {
      name: 'Video & Audio',
      slug: 'video-audio',
      icon: '🎬',
      color: 'bg-red-500',
      description: 'Video editing, voice synthesis',
      count: 29,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Explore AI tools organized by use case
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
              >
                {/* Icon with colored background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} rounded-xl mb-4 text-3xl`}>
                  {category.icon}
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-bold mb-2 group-hover:underline">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-[var(--muted)] mb-3 text-sm">
                  {category.description}
                </p>

                {/* Tool Count */}
                <div className="text-sm text-[var(--muted)]">
                  {category.count} tools
                </div>
              </Link>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-block text-lg font-semibold hover:underline"
            >
              View All Categories →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
