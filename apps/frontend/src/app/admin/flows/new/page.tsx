/**
 * Admin Flow Create Page
 * Form for creating a new discovery flow
 */

'use client';

import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminFlowCreatePage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([
    {
      id: '1',
      text: '',
      type: 'text',
      options: [],
      required: true,
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to create flow
      showToast.success('Flow created!');
      router.push('/admin/flows');
    } catch (error) {
      showToast.error('Failed to create flow');
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: '',
        type: 'text',
        options: [],
        required: true,
      },
    ]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        Create New Flow
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Flow Information</h2>
          
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Flow Title *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Find Your Content Creation Tool"
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Slug *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., content-creation"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description *</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="What will users discover?"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option>Content Creation</option>
              <option>Design</option>
              <option>Development</option>
              {/* More categories */}
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              + Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block mb-2">Question Text *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="What do you want to create?"
                  />
                </div>

                {/* Question Type */}
                <div className="mb-4">
                  <label className="block mb-2">Type *</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option value="text">Text Input</option>
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="slider">Slider</option>
                  </select>
                </div>

                {/* Options (for choice types) */}
                <div className="mb-4">
                  <label className="block mb-2">Options</label>
                  {/* Add option inputs */}
                </div>

                {/* Tag Mapping */}
                <div className="mb-4">
                  <label className="block mb-2">Tag Mapping</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Tags to extract from this answer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
          >
            Create Flow
          </button>
        </div>
      </form>
    </div>
  );
}
