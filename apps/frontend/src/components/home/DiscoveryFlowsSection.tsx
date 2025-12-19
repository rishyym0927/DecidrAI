/**
 * Discovery Flows Section
 * Highlights the discovery flow feature
 */

import Link from 'next/link';

export default function DiscoveryFlowsSection() {
  const flows = [
    {
      title: 'Content Creation Flow',
      slug: 'content-creation',
      description: 'Find the perfect tool for writing, blogging, or creating content',
      icon: '✍️',
      questions: 5,
      time: '2 min',
      color: 'bg-blue-500',
    },
    {
      title: 'Design Assistant Finder',
      slug: 'design-assistant',
      description: 'Discover AI tools for graphic design, image generation, and more',
      icon: '🎨',
      questions: 6,
      time: '3 min',
      color: 'bg-purple-500',
    },
    {
      title: 'Developer Tools Guide',
      slug: 'developer-tools',
      description: 'Get matched with coding assistants and development tools',
      icon: '💻',
      questions: 7,
      time: '3 min',
      color: 'bg-green-500',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Try Our Discovery Flows
            </h2>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Answer a few questions and get personalized recommendations
            </p>
          </div>

          {/* Flows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <Link
                key={flow.slug}
                href={`/discover/${flow.slug}`}
                className="group border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--foreground)] transition-all hover-lift bg-[var(--background)]"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${flow.color} rounded-xl mb-4 text-3xl`}>
                  {flow.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:underline">
                  {flow.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--muted)] mb-4 leading-relaxed">
                  {flow.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                  <div className="flex items-center gap-1">
                    <span>❓</span>
                    <span>{flow.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{flow.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link
              href="/discover"
              className="inline-block text-lg font-semibold hover:underline"
            >
              View All Discovery Flows →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
