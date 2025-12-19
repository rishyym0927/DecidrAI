/**
 * Flow Detail/Start Page
 * Shows flow details and start button
 */

'use client';

import { useFlow, useStartFlow } from '@/hooks';
import { showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function FlowDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data: flow, isLoading, error } = useFlow(params.slug);
  const startFlow = useStartFlow();

  const handleStart = async () => {
    try {
      const session = await startFlow.mutateAsync(params.slug);
      showToast.success('Flow started!');
      router.push(`/discover/${params.slug}/session/${session.data.sessionId}`);
    } catch (error) {
      showToast.error('Failed to start flow');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Flow not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Flow Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{/* Flow title */}</h1>
        <p className="text-xl text-gray-600">{/* Flow description */}</p>
      </div>

      {/* Flow Info */}
      <div className="bg-white dark:bg-black border rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
        <ul className="space-y-2">
          <li>⏱️ Estimated time: {/* duration */}</li>
          <li>❓ Number of questions: {/* question count */}</li>
          <li>🎯 Outcome: {/* expected outcome */}</li>
        </ul>
      </div>

      {/* Sample Questions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sample Questions</h2>
        {/* Show first 2-3 questions as preview */}
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStart}
          disabled={startFlow.isPending}
          className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-lg font-semibold hover:opacity-80 transition-opacity"
        >
          {startFlow.isPending ? 'Starting...' : 'Start Discovery Flow'}
        </button>
      </div>
    </div>
  );
}
