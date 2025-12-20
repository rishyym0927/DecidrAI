/**
 * Category Detail Layout
 * Provides base metadata for category detail pages
 */

import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo.config';

// Base metadata for category pages
export const metadata: Metadata = {
  title: {
    default: 'Category',
    template: `%s AI Tools | ${SITE_CONFIG.name}`,
  },
  description: 'Browse AI tools by category. Find the perfect tools for productivity, writing, design, development, and more.',
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
  },
};

export default function CategoryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
