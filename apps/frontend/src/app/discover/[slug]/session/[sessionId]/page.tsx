/**
 * Flow Session Page
 * Interactive questionnaire for the discovery flow
 */

'use client';

import { useState } from 'react';
import { useFlowSession, useSubmitAnswer, useCompleteFlow } from '@/hooks';
import { showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function FlowSessionPage({
  params,
}: {
  params: { slug: string; sessionId: string };
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState('');

  const { data: session, isLoading } = useFlowSession(params.sessionId);
  const submitAnswer = useSubmitAnswer();
  const completeFlow = useCompleteFlow();

  const handleSubmit = async () => {
    try {
      const result = await submitAnswer.mutateAsync({
        sessionId: params.sessionId,
        answer,
      });

      if (result.data.completed) {
        // Flow is complete, get recommendations
        const tags = await completeFlow.mutateAsync(params.sessionId);
        router.push(`/discover/${params.slug}/results/${params.sessionId}`);
      } else {
        // Move to next question
        setAnswer('');
        showToast.success('Answer submitted!');
      }
    } catch (error) {
      showToast.error('Failed to submit answer');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {/* current */} of {/* total */}</span>
          <span>{/* percentage */}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{/* Current question text */}</h1>
        <p className="text-gray-600">{/* Question description/hint */}</p>
      </div>

      {/* Answer Input */}
      <div className="mb-8">
        {/* Render different input types based on question type */}
        {/* - Text input */}
        {/* - Multiple choice */}
        {/* - Checkboxes */}
        {/* - Slider */}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitAnswer.isPending || !answer}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          {submitAnswer.isPending ? 'Submitting...' : 'Next'}
        </button>
      </div>
    </div>
  );
}
