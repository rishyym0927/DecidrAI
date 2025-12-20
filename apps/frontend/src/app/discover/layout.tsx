/**
 * Discover Layout
 * Provides metadata for the discovery flows listing page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Discover AI Tools',
  description: 'Find your perfect AI tool through guided discovery flows. Answer a few questions and get personalized recommendations tailored to your needs.',
  path: '/discover',
  keywords: ['AI tool finder', 'AI recommendations', 'tool discovery', 'AI guide'],
});

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
