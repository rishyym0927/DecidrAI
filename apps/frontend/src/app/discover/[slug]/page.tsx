/**
 * Flow Detail Page
 * Shows flow info and allows starting the flow
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow, useStartFlow } from '@/hooks';
import { showToast } from '@/lib/toast';
import Link from 'next/link';

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'career': 'bg-blue-500',
  'productivity': 'bg-yellow-500',
  'automation': 'bg-purple-500',
  'development': 'bg-green-500',
  'learning': 'bg-orange-500',
  'marketing': 'bg-pink-500',
  'design': 'bg-indigo-500',
};

export default function FlowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: response, isLoading, error } = useFlow(slug);
  const startFlowMutation = useStartFlow();

  const flow = response?.data;

  const handleStartFlow = async () => {
    try {
      const result = await startFlowMutation.mutateAsync({ slug });
      showToast.success('Flow started!');
      router.push(`/discover/${slug}/session/${result.data.sessionId}`);
    } catch (err) {
      showToast.error('Failed to start flow');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⚡</div>
          <p className="text-xl text-[var(--muted)]">Loading flow...</p>
        </div>
      </div>
    );
  }

  if (error || !flow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Flow Not Found</h1>
          <p className="text-[var(--muted)] mb-6">
            This discovery flow doesn't exist or has been removed.
          </p>
          <Link
            href="/discover"
            className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Browse All Flows
          </Link>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[flow.category] || 'bg-gray-500';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-24 h-24 ${categoryColor} rounded-2xl mb-6 text-5xl`}>
              {flow.icon}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {flow.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-[var(--muted)] mb-8">
              {flow.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-lg">
                <span>❓</span>
                <span>{flow.totalQuestions} questions</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <span>⏱️</span>
                <span>{flow.estimatedTimeMinutes} minutes</span>
              </div>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full capitalize">
                {flow.category}
              </span>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartFlow}
              disabled={startFlowMutation.isPending}
              className="px-10 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-bold text-lg hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {startFlowMutation.isPending ? 'Starting...' : 'Start Discovery →'}
            </button>
          </div>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What You'll Be Asked
          </h2>

          <div className="space-y-4">
            {flow.questions.map((question, index) => (
              <div
                key={question.id}
                className="flex gap-4 p-6 border border-[var(--border)] rounded-xl bg-[var(--surface)]"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium">{question.text}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {question.type === 'single' && 'Select one option'}
                    {question.type === 'multiple' && 'Select multiple options'}
                    {question.type === 'text' && 'Free text answer'}
                    {question.type === 'scale' && 'Rate on a scale'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={handleStartFlow}
              disabled={startFlowMutation.isPending}
              className="px-10 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-bold text-lg hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {startFlowMutation.isPending ? 'Starting...' : 'Start Discovery →'}
            </button>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Get personalized AI tool recommendations based on your answers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
