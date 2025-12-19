/**
 * Admin Flow Edit Page
 * Edit existing flow
 */

'use client';

import AdminFlowFormPage from '../../new/page';

export default function AdminFlowEditPage({ params }: { params: { id: string } }) {
  // Reuse the form component
  return <AdminFlowFormPage params={params} />;
}
