/**
 * Tools Directory Layout
 * Provides metadata for the tools listing page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Tools Directory',
  description: 'Browse and discover the best AI tools for productivity, writing, design, development, and more. Compare features and find your perfect match.',
  path: '/tools',
  keywords: ['AI tools directory', 'AI software', 'productivity tools', 'AI apps'],
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
