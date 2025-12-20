/**
 * Compare Layout
 * Provides metadata for the comparison page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Compare AI Tools',
  description: 'Compare AI tools side-by-side with AI-powered analysis. See features, pricing, and get recommendations on which tool is best for your use case.',
  path: '/compare',
  keywords: ['AI tool comparison', 'compare AI apps', 'tool vs tool', 'AI software comparison'],
});

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
