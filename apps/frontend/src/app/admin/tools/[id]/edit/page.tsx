/**
 * Admin Tool Edit Page
 * Edit existing tool
 */

'use client';

import AdminToolFormPage from '../../new/page';

export default function AdminToolEditPage({ params }: { params: { id: string } }) {
  // Reuse the form component, it handles both create and edit
  return <AdminToolFormPage params={params} />;
}
