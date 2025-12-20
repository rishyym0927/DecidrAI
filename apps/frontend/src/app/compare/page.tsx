/**
 * Tool Comparison Page
 * Side-by-side comparison of AI tools
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompareTools, useTools } from '@/hooks';
import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Share2, Copy, Check } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get tools from URL params
  const toolsParam = searchParams.get('tools');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    toolsParam ? toolsParam.split(',').filter(Boolean) : []
  );

  // Fetch all tools for selector
  const { data: toolsResponse } = useTools({ limit: 50 });
  const allTools = toolsResponse?.data?.tools || [];

  // Fetch comparison data
  const { data: comparisonResponse, isLoading, error } = useCompareTools(selectedSlugs);
  const comparison = (comparisonResponse as any)?.data;

  // Update URL when selection changes
  useEffect(() => {
    if (selectedSlugs.length >= 2) {
      router.push(`/compare?tools=${selectedSlugs.join(',')}`, { scroll: false });
    }
  }, [selectedSlugs, router]);

  const addTool = (slug: string) => {
    if (!selectedSlugs.includes(slug) && selectedSlugs.length < 4) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const removeTool = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
  };

  const clearAll = () => {
    setSelectedSlugs([]);
    router.push('/compare');
  };

  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const toolNames = comparison?.tools?.map((t: any) => t.name).join(' vs ') || 'AI Tools';
    const text = `Check out my AI tool comparison: ${toolNames}`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare AI Tools
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl">
            Select up to 4 tools to compare side-by-side
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tool Selector */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Select Tools to Compare</h2>
          
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Select tools to compare">
            {allTools.map((tool: Tool) => {
              const isSelected = selectedSlugs.includes(tool.slug);
              const isDisabled = !isSelected && selectedSlugs.length >= 4;
              return (
                <button
                  key={tool.slug}
                  onClick={() => isSelected ? removeTool(tool.slug) : addTool(tool.slug)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isDisabled) {
                        isSelected ? removeTool(tool.slug) : addTool(tool.slug);
                      }
                    }
                  }}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Remove' : 'Add'} ${tool.name} ${isDisabled ? '(maximum 4 tools selected)' : ''}`}
                  className={`px-4 py-2 rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                    isSelected
                      ? 'bg-[var(--foreground)] text-[var(--background)]'
                      : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSelected && '✓ '}{tool.name}
                </button>
              );
            })}
          </div>

          {/* Selected Tools */}
          {selectedSlugs.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-[var(--muted)]">
                {selectedSlugs.length} tool{selectedSlugs.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={clearAll}
                className="text-sm text-red-500 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Comparison Content */}
        {selectedSlugs.length < 2 ? (
          <div className="text-center py-20 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold mb-2">Select at least 2 tools</h3>
            <p className="text-[var(--muted)]">
              Choose tools from above to see a detailed comparison
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-xl text-[var(--muted)]">Generating comparison...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-[var(--border)] rounded-2xl">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold mb-2">Comparison Failed</h3>
            <p className="text-[var(--muted)]">Unable to generate comparison</p>
          </div>
        ) : comparison ? (
          <div className="space-y-12">
            {/* Tools Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Tools Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {comparison.tools.map((tool: any) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="p-6 border border-[var(--border)] rounded-2xl hover:border-[var(--foreground)] transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">
                      {tool.tagline}
                    </p>
                    <span className="inline-block px-3 py-1 bg-[var(--surface)] rounded-full text-xs capitalize">
                      {tool.pricing}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* AI Summary */}
            {comparison.summary && (
              <section>
                <h2 className="text-2xl font-bold mb-4">AI Summary</h2>
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                  <p className="text-lg leading-relaxed">{comparison.summary}</p>
                </div>
              </section>
            )}

            {/* Share Buttons */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Share This Comparison</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-full hover:border-[var(--foreground)] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Twitter
                </button>
              </div>
            </section>

            {/* Winner Scenarios */}
            {comparison.winnerScenarios && comparison.winnerScenarios.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Best For</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparison.winnerScenarios.map((scenario: any, index: number) => (
                    <div
                      key={index}
                      className="p-6 border border-[var(--border)] rounded-2xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🏆</span>
                        <span className="font-bold">{scenario.toolSlug}</span>
                      </div>
                      <p className="text-lg font-medium mb-2">{scenario.scenario}</p>
                      <p className="text-sm text-[var(--muted)]">{scenario.reasoning}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Feature Comparison Table */}
            {comparison.featureComparison && comparison.featureComparison.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-[var(--border)] rounded-2xl overflow-hidden">
                    <thead>
                      <tr className="bg-[var(--surface)]">
                        <th className="text-left p-4 font-semibold border-b border-[var(--border)]">
                          Feature
                        </th>
                        {comparison.tools.map((tool: any) => (
                          <th
                            key={tool.slug}
                            className="text-left p-4 font-semibold border-b border-[var(--border)]"
                          >
                            {tool.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.featureComparison.map((row: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                          <td className="p-4 font-medium border-b border-[var(--border)]">
                            {row.feature}
                          </td>
                          {comparison.tools.map((tool: any) => (
                            <td
                              key={tool.slug}
                              className="p-4 border-b border-[var(--border)]"
                            >
                              {row.toolValues[tool.slug] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        ) : null}

        {/* Popular Comparisons */}
        <section className="mt-16 pt-12 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6">Popular Comparisons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tools: ['chatgpt', 'claude'], label: 'ChatGPT vs Claude' },
              { tools: ['github-copilot', 'chatgpt'], label: 'GitHub Copilot vs ChatGPT' },
              { tools: ['midjourney', 'runway-ml'], label: 'Midjourney vs Runway ML' },
              { tools: ['notion-ai', 'jasper'], label: 'Notion AI vs Jasper' },
              { tools: ['grammarly', 'jasper'], label: 'Grammarly vs Jasper' },
              { tools: ['perplexity', 'chatgpt'], label: 'Perplexity vs ChatGPT' },
            ].map((comp) => (
              <Link
                key={comp.label}
                href={`/compare?tools=${comp.tools.join(',')}`}
                className="p-4 border border-[var(--border)] rounded-xl hover:border-[var(--foreground)] transition-colors text-center"
              >
                <span className="font-medium">{comp.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
