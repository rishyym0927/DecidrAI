/**
 * Admin Flow Edit Page
 * Edit existing flow (placeholder)
 */

'use client';

import { use } from 'react';
import Link from 'next/link';

export default function AdminFlowEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
            <Link href="/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <Link href="/admin/flows" className="hover:underline">Flows</Link>
            <span>/</span>
            <span>Edit</span>
          </div>
          <h1 className="text-3xl font-bold">Edit Flow</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl">
          <div className="p-8 border border-[var(--border)] rounded-2xl text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Edit Flow: {id}</h2>
            <p className="text-[var(--muted)] mb-6">
              Flow editing form will be implemented here.
            </p>
            <Link
              href="/admin/flows"
              className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              Back to Flows
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
