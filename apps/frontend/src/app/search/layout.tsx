/**
 * Search Layout
 * Provides metadata for the search page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search AI Tools',
  description: 'Search through hundreds of curated AI tools. Find the perfect solution for productivity, writing, coding, design, and more.',
  path: '/search',
  keywords: ['search AI tools', 'find AI apps', 'AI tool search'],
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
