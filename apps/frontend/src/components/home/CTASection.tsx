/**
 * Final CTA Section
 * Encourages users to start their discovery journey
 */

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-[var(--foreground)] text-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Find Your Perfect AI Tool?
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-12 opacity-80">
            Join thousands of users who've discovered the right tools for their needs
          </p>

          {/* CTA Button */}
          <Link
            href="/discover"
            className="inline-block px-10 py-5 bg-[var(--background)] text-[var(--foreground)] rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Start Your Discovery Journey
          </Link>

          {/* Additional Info */}
          <p className="mt-8 text-sm opacity-70">
            No credit card required • Free to use • Takes less than 3 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
