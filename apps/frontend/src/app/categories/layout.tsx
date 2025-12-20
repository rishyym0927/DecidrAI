/**
 * Categories Layout
 * Provides metadata for the categories listing page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Tool Categories',
  description: 'Browse AI tools by category: productivity, writing, design, development, marketing, and more. Find tools organized by what they do best.',
  path: '/categories',
  keywords: ['AI categories', 'AI tool types', 'productivity AI', 'writing AI', 'design AI'],
});

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
