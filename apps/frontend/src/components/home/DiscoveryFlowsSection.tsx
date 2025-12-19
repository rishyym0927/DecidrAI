/**
 * Discovery Flows Section
 * Fetches and displays discovery flows from API
 */

'use client';

import Link from 'next/link';
import { useFlows } from '@/hooks';
import FlowCard from '@/components/discover/FlowCard';
import type { FlowSummary } from '@/types/flow';

export default function DiscoveryFlowsSection() {
  const { data: response, isLoading } = useFlows({ limit: 3, sort: 'popular' });
  const flows = response?.data?.flows || [];

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

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-[var(--border)] rounded-2xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-[var(--border)] rounded-xl mb-4"></div>
                  <div className="h-6 bg-[var(--border)] rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-[var(--border)] rounded w-full mb-2"></div>
                  <div className="h-4 bg-[var(--border)] rounded w-2/3 mb-4"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-[var(--border)] rounded w-16"></div>
                    <div className="h-4 bg-[var(--border)] rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Flows Grid */}
          {!isLoading && flows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flows.map((flow: FlowSummary) => (
                <FlowCard key={flow._id} flow={flow} />
              ))}
            </div>
          )}

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
