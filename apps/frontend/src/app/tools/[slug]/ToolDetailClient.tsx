/**
 * Tool Detail Client Component
 * Interactive UI for tool detail page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';
import { useAuth } from '@clerk/nextjs';
import { useSaveTool, useUnsaveTool, useSavedTools, useAddToAiStack } from '@/hooks';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { analytics } from '@/lib/analytics';

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  'productivity': 'bg-yellow-500',
  'writing': 'bg-blue-500',
  'marketing': 'bg-orange-500',
  'design': 'bg-purple-500',
  'creativity': 'bg-purple-500',
  'video': 'bg-red-500',
  'audio': 'bg-red-500',
  'collaboration': 'bg-cyan-500',
};

interface ToolDetailClientProps {
  tool: Tool;
  relatedTools: Tool[];
}

export default function ToolDetailClient({ tool, relatedTools }: ToolDetailClientProps) {
  const { isSignedIn } = useAuth();
  const category = tool.categories?.[0] || 'other';
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500';
  const [showStackModal, setShowStackModal] = useState(false);
  const [stackCategory, setStackCategory] = useState('');

  // Save functionality
  const { data: savedToolsData } = useSavedTools();
  const saveMutation = useSaveTool();
  const unsaveMutation = useUnsaveTool();
  const addToStackMutation = useAddToAiStack();
  
  const isSaved = savedToolsData?.data?.some(
    (saved: any) => saved.toolId === tool._id || saved.toolId?._id === tool._id
  ) ?? false;

  const handleSave = () => {
    if (!isSignedIn) {
      showToast.error('Please sign in to save tools');
      return;
    }
    if (isSaved) {
      unsaveMutation.mutate(tool._id, {
        onSuccess: () => showToast.success('Removed from saved'),
        onError: () => showToast.error('Failed to remove'),
      });
    } else {
      saveMutation.mutate({ toolId: tool._id }, {
        onSuccess: () => showToast.success('Tool saved!'),
        onError: () => showToast.error('Failed to save'),
      });
    }
  };

  const handleAddToStack = () => {
    if (!isSignedIn) {
      showToast.error('Please sign in to add to your stack');
      return;
    }
    if (!stackCategory) {
      showToast.error('Please select a category');
      return;
    }
    addToStackMutation.mutate({ toolId: tool._id, category: stackCategory }, {
      onSuccess: () => {
        showToast.success('Added to your AI Stack!');
        setShowStackModal(false);
        setStackCategory('');
      },
      onError: () => showToast.error('Failed to add to stack'),
    });
  };

  const handleWebsiteClick = () => {
    analytics.toolClicked(tool.slug, 'detail_page');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: 'Home', href: '/' },
                { label: 'Tools', href: '/tools' },
                { label: tool.name }
              ]} />
            </div>

            {/* Logo and Name */}
            <div className="flex items-start gap-6 mb-6">
              <div className={`flex-shrink-0 w-20 h-20 ${categoryColor} rounded-2xl flex items-center justify-center text-4xl overflow-hidden`}>
                {tool.logo_url ? (
                  <Image 
                    src={tool.logo_url} 
                    alt={tool.name}
                    width={64}
                    height={64}
                    className="object-contain"
                    unoptimized={tool.logo_url.includes('data:')}
                  />
                ) : (
                  <span>🤖</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {tool.name}
                </h1>
                <p className="text-xl text-[var(--muted)]">
                  {tool.tagline}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full font-medium capitalize">
                {category}
              </span>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full capitalize">
                {tool.pricing.model}
                {tool.pricing.starting_price > 0 && ` - From $${tool.pricing.starting_price}`}
              </span>
              <span className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full">
                👁️ {tool.view_count} views
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-3xl font-bold mb-4">About {tool.name}</h2>
                <p className="text-lg text-[var(--muted)] leading-relaxed">
                  {tool.long_description || tool.description}
                </p>
              </section>

              {/* Use Cases */}
              {tool.use_cases && tool.use_cases.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Use Cases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.use_cases.map((useCase: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 border border-[var(--border)] rounded-xl"
                      >
                        <span className="text-2xl text-green-500">✓</span>
                        <span className="flex-1">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Best For */}
              {tool.best_for && tool.best_for.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Best For</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.best_for.map((item: string) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                      >
                        👤 {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Not Good For */}
              {tool.not_good_for && tool.not_good_for.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Limitations</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.not_good_for.map((item: string) => (
                      <span
                        key={item}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full"
                      >
                        ⚠️ {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Integrations */}
              {tool.integrations && tool.integrations.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Integrations</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.integrations.map((integration: string) => (
                      <span
                        key={integration}
                        className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm"
                      >
                        🔗 {integration}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--surface)]">
                <h3 className="text-xl font-bold mb-4">Get Started</h3>
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWebsiteClick}
                  className="block w-full px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold text-center hover:opacity-80 transition-opacity mb-3"
                >
                  Visit Website →
                </a>
                <Link
                  href={`/compare?tools=${tool.slug}`}
                  className="block w-full px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold text-center hover:bg-[var(--background)] transition-colors mb-3"
                >
                  Compare Tool
                </Link>
                
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending || unsaveMutation.isPending}
                  className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold transition-colors mb-3 ${
                    isSaved 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  {saveMutation.isPending || unsaveMutation.isPending ? 'Saving...' : isSaved ? 'Saved' : 'Save Tool'}
                </button>

                {/* Add to Stack Button */}
                <button
                  onClick={() => setShowStackModal(true)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add to AI Stack
                </button>
              </div>

              {/* Add to Stack Modal */}
              {showStackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-[var(--background)] rounded-2xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-bold mb-4">Add to Your AI Stack</h3>
                    <p className="text-[var(--muted)] mb-4">Choose a category for {tool.name}</p>
                    <select
                      value={stackCategory}
                      onChange={(e) => setStackCategory(e.target.value)}
                      className="w-full p-3 border border-[var(--border)] rounded-lg mb-4 bg-[var(--background)]"
                    >
                      <option value="">Select category...</option>
                      <option value="Writing">Writing</option>
                      <option value="Coding">Coding</option>
                      <option value="Design">Design</option>
                      <option value="Research">Research</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowStackModal(false)}
                        className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddToStack}
                        disabled={addToStackMutation.isPending || !stackCategory}
                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                      >
                        {addToStackMutation.isPending ? 'Adding...' : 'Add to Stack'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Info */}
              <div className="border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Pricing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Model</span>
                    <span className="font-semibold capitalize">{tool.pricing.model}</span>
                  </div>
                  {tool.pricing.starting_price > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Starting at</span>
                      <span className="font-semibold">${tool.pricing.starting_price}/mo</span>
                    </div>
                  )}
                  {tool.pricing.tiers && tool.pricing.tiers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <p className="text-sm text-[var(--muted)] mb-2">Available Plans:</p>
                      {tool.pricing.tiers.map((tier) => (
                        <div key={tier.name} className="flex justify-between text-sm py-1">
                          <span>{tier.name}</span>
                          <span>${tier.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Learning Curve</span>
                    <span className="capitalize">{tool.learning_curve}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Has API</span>
                    <span>{tool.has_api ? '✓ Yes' : '✗ No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Platforms</span>
                    <span>{tool.platforms?.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Similar Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.slice(0, 3).map((relatedTool: Tool) => (
                  <ToolCard key={relatedTool._id} tool={relatedTool} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
