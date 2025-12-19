/**
 * Hero Section Component
 * Main headline and CTA for the homepage
 */

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The Google for
            <br />
            <span className="italic">AI Decisions</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[var(--muted)] mb-12 max-w-2xl mx-auto">
            Stop endless searching. Answer a few questions, get personalized AI tool 
            recommendations that actually fit your needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/discover"
              className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-lg hover:opacity-80 transition-opacity w-full sm:w-auto text-center"
            >
              Start Discovery
            </Link>
            <Link
              href="/tools"
              className="px-8 py-4 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-lg hover:bg-[var(--surface)] transition-colors w-full sm:w-auto text-center"
            >
              Browse Tools
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Intent-Based</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Fast & Simple</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
