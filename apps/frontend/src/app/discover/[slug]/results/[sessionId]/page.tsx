/**
 * Flow Results Page
 * Shows personalized tool recommendations using consistent ToolCard component
 */

'use client';

import { use } from 'react';
import { useFlowSession, useRecommendationsBySession } from '@/hooks';
import ToolCard from '@/components/tools/ToolCard';
import Link from 'next/link';
import type { Tool } from '@/types/tool';

export default function FlowResultsPage({ 
  params 
}: { 
  params: Promise<{ slug: string; sessionId: string }> 
}) {
  const { slug, sessionId } = use(params);
  
  const { data: sessionResponse, isLoading: isLoadingSession } = useFlowSession(sessionId);
  const { data: recommendationsResponse, isLoading: isLoadingRecommendations } = useRecommendationsBySession(sessionId);

  const session = sessionResponse?.data;
  const recommendations = (recommendationsResponse as any)?.data?.recommendations || [];

  const isLoading = isLoadingSession || isLoadingRecommendations;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⚡</div>
          <p className="text-xl text-[var(--muted)]">Analyzing your preferences...</p>
          <p className="text-sm text-[var(--muted)] mt-2">Finding the perfect tools for you</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Session Not Found</h1>
          <p className="text-[var(--muted)] mb-6">
            This session doesn't exist or has expired.
          </p>
          <Link
            href="/discover"
            className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Start New Discovery
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
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your AI Tool Recommendations
            </h1>
            <p className="text-xl text-[var(--muted)]">
              Based on your answers in "{session.flow.title}"
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[var(--muted)]">
              <span>{session.answeredQuestions} questions answered</span>
              <span className="w-1 h-1 bg-[var(--border)] rounded-full"></span>
              <span>{recommendations.length} tools matched</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Your Needs */}
          {session.extractedTags && session.extractedTags.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Your Needs</h2>
              <div className="flex flex-wrap gap-2">
                {session.extractedTags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations - Using consistent ToolCard */}
          {recommendations.length > 0 ? (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Recommended Tools ({recommendations.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec: any, index: number) => {
                  const tool: Tool = rec.tool || rec;
                  const score = rec.score || rec.matchScore;

                  return (
                    <div key={tool._id} className="relative">
                      {/* Match Score Badge */}
                      {score && (
                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                          {Math.round(score * 100)}%
                        </div>
                      )}
                      {/* Rank Badge for top 3 */}
                      {index < 3 && (
                        <div className="absolute -top-2 -left-2 text-2xl z-10">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      )}
                      <ToolCard tool={tool} />
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-4">No Recommendations Yet</h2>
              <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
                We couldn't find specific tool recommendations based on your answers. 
                Try browsing our tools directory instead.
              </p>
              <Link
                href="/tools"
                className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
              >
                Browse All Tools
              </Link>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-[var(--border)]">
            <Link
              href="/tools"
              className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              href="/discover"
              className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              Try Another Flow
            </Link>
          </div>

          {/* Session Info */}
          <div className="mt-8 text-center text-sm text-[var(--muted)]">
            <p>Session completed • {session.answeredQuestions} questions answered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
