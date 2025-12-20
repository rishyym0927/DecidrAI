/**
 * Flow Detail Layout
 * Provides base metadata for flow detail pages
 */

import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo.config';

// Base metadata - specific pages can override with generateMetadata
export const metadata: Metadata = {
  title: {
    default: 'Discovery Flow',
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: 'Find your perfect AI tool through our guided discovery flow. Answer a few questions and get personalized recommendations.',
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
  },
};

export default function FlowDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
