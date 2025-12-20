/**
 * Profile Layout
 * Provides metadata for the profile page
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Profile',
  description: 'Manage your saved AI tools, view your discovery flow history, and update your preferences on DecidrAI.',
  path: '/profile',
  noIndex: true, // Profile pages shouldn't be indexed
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
