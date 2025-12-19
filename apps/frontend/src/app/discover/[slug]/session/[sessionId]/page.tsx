/**
 * Flow Session Page
 * Interactive questionnaire for a discovery flow
 */

'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlowSession, useSubmitAnswer, useCompleteFlow } from '@/hooks';
import { showToast } from '@/lib/toast';
import Link from 'next/link';
import type { Question as QuestionType } from '@/types/flow';

export default function FlowSessionPage({ 
  params 
}: { 
  params: Promise<{ slug: string; sessionId: string }> 
}) {
  const { slug, sessionId } = use(params);
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string | string[]>('');
  
  const { data: response, isLoading, error, refetch } = useFlowSession(sessionId);
  const submitAnswerMutation = useSubmitAnswer();
  const completeFlowMutation = useCompleteFlow();

  const session = response?.data;

  const handleOptionSelect = (value: string, isMultiple: boolean) => {
    if (isMultiple) {
      setSelectedValue(prev => {
        const currentValues = Array.isArray(prev) ? prev : [];
        if (currentValues.includes(value)) {
          return currentValues.filter(v => v !== value);
        }
        return [...currentValues, value];
      });
    } else {
      setSelectedValue(value);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session?.currentQuestion || !selectedValue || 
        (Array.isArray(selectedValue) && selectedValue.length === 0)) {
      showToast.error('Please select an answer');
      return;
    }

    try {
      const result = await submitAnswerMutation.mutateAsync({
        sessionId,
        questionId: session.currentQuestion.id,
        value: selectedValue,
      });

      if (result.data.status === 'completed') {
        showToast.success('Flow completed!');
        router.push(`/discover/${slug}/results/${sessionId}`);
      } else {
        // Clear selection for next question
        setSelectedValue('');
        // Refetch to get next question
        await refetch();
      }
    } catch (err) {
      showToast.error('Failed to submit answer');
    }
  };

  const handleSkipToResults = async () => {
    try {
      await completeFlowMutation.mutateAsync(sessionId);
      showToast.success('Flow completed!');
      router.push(`/discover/${slug}/results/${sessionId}`);
    } catch (err) {
      showToast.error('Failed to complete flow');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⚡</div>
          <p className="text-xl text-[var(--muted)]">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
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

  if (session.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-4">Flow Already Completed</h1>
          <p className="text-[var(--muted)] mb-6">
            This flow has already been completed.
          </p>
          <Link
            href={`/discover/${slug}/results/${sessionId}`}
            className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            View Results
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = session.currentQuestion;
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4">All Questions Answered!</h1>
          <p className="text-[var(--muted)] mb-6">
            Click below to see your recommendations.
          </p>
          <button
            onClick={handleSkipToResults}
            disabled={completeFlowMutation.isPending}
            className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {completeFlowMutation.isPending ? 'Loading...' : 'Get Recommendations'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--surface)] z-50">
        <div 
          className="h-full bg-[var(--foreground)] transition-all duration-500"
          style={{ width: `${session.progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{session.flow.icon}</span>
              <div>
                <h1 className="text-xl font-bold">{session.flow.title}</h1>
                <p className="text-sm text-[var(--muted)]">
                  Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkipToResults}
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Skip to Results →
            </button>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Question Text */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          {currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === 'multiple'
                  ? Array.isArray(selectedValue) && selectedValue.includes(option.value)
                  : selectedValue === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value, currentQuestion.type === 'multiple')}
                    className={`w-full p-5 text-left border-2 rounded-xl transition-all ${
                      isSelected
                        ? 'border-[var(--foreground)] bg-[var(--surface)]'
                        : 'border-[var(--border)] hover:border-[var(--foreground)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-${currentQuestion.type === 'multiple' ? 'md' : 'full'} border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-[var(--foreground)] bg-[var(--foreground)]' 
                          : 'border-[var(--border)]'
                      }`}>
                        {isSelected && (
                          <span className="text-[var(--background)] text-sm">✓</span>
                        )}
                      </div>
                      <span className="text-lg">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmitAnswer}
              disabled={submitAnswerMutation.isPending || !selectedValue || 
                (Array.isArray(selectedValue) && selectedValue.length === 0)}
              className="px-10 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-bold text-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitAnswerMutation.isPending ? 'Submitting...' : 'Continue'}
            </button>
          </div>

          {/* Helper Text */}
          {currentQuestion.type === 'multiple' && (
            <p className="text-center text-sm text-[var(--muted)] mt-4">
              Select all that apply
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
