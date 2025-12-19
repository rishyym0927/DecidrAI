/**
 * Admin Tools Management Page
 * CRUD operations for tools
 */

'use client';

import { useState } from 'react';
import { useTools } from '@/hooks';
import Link from 'next/link';
import type { Tool } from '@/types/tool';

export default function AdminToolsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: response, isLoading, refetch } = useTools({ 
    page, 
    limit: 10,
    category: category || undefined,
  });

  const tools = response?.data?.tools || [];
  const pagination = response?.data?.pagination;

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'writing', label: 'Writing' },
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'design', label: 'Design' },
    { value: 'video', label: 'Video' },
  ];

  const handleDelete = async (toolId: string, toolName: string) => {
    if (!confirm(`Are you sure you want to delete "${toolName}"?`)) return;
    
    // TODO: Implement delete API call
    alert('Delete functionality requires backend integration');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
                <Link href="/admin" className="hover:underline">Admin</Link>
                <span>/</span>
                <span>Tools</span>
              </div>
              <h1 className="text-3xl font-bold">Manage Tools</h1>
            </div>
            <Link
              href="/admin/tools/new"
              className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              + Add Tool
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="mb-4 text-[var(--muted)]">
            Showing {tools.length} of {pagination.total} tools
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
            <p className="text-[var(--muted)]">Loading tools...</p>
          </div>
        )}

        {/* Tools Table */}
        {!isLoading && tools.length > 0 && (
          <div className="border border-[var(--border)] rounded-2xl overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-semibold hidden lg:table-cell">Pricing</th>
                  <th className="text-left p-4 font-semibold hidden lg:table-cell">Views</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool: Tool) => (
                  <tr key={tool._id} className="border-t border-[var(--border)] hover:bg-[var(--surface)]">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-[var(--muted)] truncate max-w-[200px]">
                          {tool.tagline}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2 py-1 bg-[var(--surface)] rounded text-sm capitalize">
                        {tool.categories?.[0] || '-'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell capitalize">
                      {tool.pricing?.model || '-'}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {tool.view_count || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:border-[var(--foreground)] transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/tools/${tool._id}/edit`}
                          className="px-3 py-1 text-sm border border-[var(--border)] rounded hover:border-[var(--foreground)] transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tool._id, tool.name)}
                          className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tools.length === 0 && (
          <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold mb-2">No tools found</h3>
            <p className="text-[var(--muted)] mb-6">
              {category ? 'Try a different category' : 'Add your first tool to get started'}
            </p>
            <Link
              href="/admin/tools/new"
              className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              Add Tool
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.pages}
              className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
