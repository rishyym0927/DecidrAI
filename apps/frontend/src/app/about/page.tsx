/**
 * About Page
 * Information about DecidrAI
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'About DecidrAI',
  description: 'Learn how DecidrAI helps you discover the right AI tools through intelligent, intent-based recommendations and curated comparisons.',
  path: '/about',
});

export default function AboutPage() {
  const features = [
    {
      icon: '🎯',
      title: 'Intent-Based Discovery',
      description: 'We match you with tools based on what you want to accomplish, not just keywords.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Recommendations',
      description: 'Our intelligent system analyzes your needs and provides personalized suggestions.',
    },
    {
      icon: '⚖️',
      title: 'Side-by-Side Comparisons',
      description: 'Compare tools directly to make confident, informed decisions.',
    },
    {
      icon: '⚡',
      title: 'Fast & Simple',
      description: 'Get recommendations in minutes, not hours of endless browsing.',
    },
    {
      icon: '🎓',
      title: 'Curated Directory',
      description: 'Every tool is reviewed and categorized by our team for accuracy.',
    },
    {
      icon: '🆓',
      title: 'Free to Use',
      description: 'No sign-up required to discover tools. Completely free, no hidden costs.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Start a Discovery Flow',
      description: 'Choose a flow based on your goal: content creation, development, marketing, and more.',
    },
    {
      number: '02',
      title: 'Answer Simple Questions',
      description: 'Our AI asks about your specific needs, budget, experience level, and preferences.',
    },
    {
      number: '03',
      title: 'Get Personalized Matches',
      description: 'Receive AI-powered recommendations ranked by how well they fit your requirements.',
    },
    {
      number: '04',
      title: 'Compare & Decide',
      description: 'Use our comparison tool to evaluate options side-by-side and make your choice.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About DecidrAI
          </h1>
          <p className="text-xl md:text-2xl text-[var(--muted)] max-w-3xl mx-auto">
            The intelligent, curated discovery platform that helps you choose the right AI tools 
            quickly and confidently.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-[var(--muted)] leading-relaxed mb-8">
              In a world overflowing with AI tools, finding the right one shouldn't feel like 
              finding a needle in a haystack. We built DecidrAI to cut through the noise and 
              help you discover tools that actually fit your needs — not just the most popular 
              or heavily marketed ones.
            </p>
            <p className="text-xl text-[var(--muted)] leading-relaxed">
              We believe that <strong className="text-[var(--foreground)]">intent-based recommendations</strong> are 
              the future. Instead of browsing endless directories, you tell us what you want 
              to accomplish, and we match you with the perfect tools.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="text-6xl font-bold text-[var(--border)] mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Why DecidrAI?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="p-6 border border-[var(--border)] rounded-2xl">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Perfect AI Tool?
            </h2>
            <p className="text-xl text-[var(--muted)] mb-8">
              Start a discovery flow and get personalized recommendations in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/discover"
                className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                Start Discovery
              </Link>
              <Link
                href="/tools"
                className="px-8 py-4 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-lg hover:bg-[var(--background)] transition-colors"
              >
                Browse Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-[var(--muted)] mb-6">
              We'd love to hear from you. Whether you have feedback, suggestions, or just want to say hi.
            </p>
            <a
              href="mailto:hello@decidrai.com"
              className="text-lg font-medium hover:underline"
            >
              hello@decidrai.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
