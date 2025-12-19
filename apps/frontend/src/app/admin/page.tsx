/**
 * Admin Dashboard
 * Overview with stats and recent activity
 */

'use client';

import { useTools, useFlows } from '@/hooks';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: toolsResponse, isLoading: loadingTools } = useTools({ limit: 5 });
  const { data: flowsResponse, isLoading: loadingFlows } = useFlows({ limit: 5 });

  const toolsTotal = toolsResponse?.data?.pagination?.total || 0;
  const flowsTotal = flowsResponse?.data?.pagination?.total || 0;
  const recentTools = toolsResponse?.data?.tools || [];
  const recentFlows = flowsResponse?.data?.flows || [];

  const isLoading = loadingTools || loadingFlows;

  const stats = [
    {
      label: 'Total Tools',
      value: toolsTotal,
      icon: '🛠️',
      href: '/admin/tools',
      color: 'bg-blue-500',
    },
    {
      label: 'Discovery Flows',
      value: flowsTotal,
      icon: '🎯',
      href: '/admin/flows',
      color: 'bg-purple-500',
    },
    {
      label: 'Categories',
      value: 9,
      icon: '📁',
      href: '/categories',
      color: 'bg-green-500',
    },
    {
      label: 'Comparisons',
      value: 124,
      icon: '⚖️',
      href: '/admin',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-[var(--muted)]">Manage tools, flows, and content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-6 border border-[var(--border)] rounded-2xl hover:border-[var(--foreground)] transition-colors bg-[var(--background)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </span>
                <span className="text-3xl font-bold">
                  {isLoading ? '...' : stat.value}
                </span>
              </div>
              <p className="text-[var(--muted)] font-medium">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/tools/new"
              className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
            >
              + Add New Tool
            </Link>
            <Link
              href="/admin/flows/new"
              className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
            >
              + Create Flow
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tools */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Tools</h2>
              <Link href="/admin/tools" className="text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center text-[var(--muted)]">Loading...</div>
              ) : recentTools.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[var(--surface)]">
                    <tr>
                      <th className="text-left p-4 font-semibold">Name</th>
                      <th className="text-left p-4 font-semibold">Category</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTools.map((tool: any) => (
                      <tr key={tool._id} className="border-t border-[var(--border)]">
                        <td className="p-4">
                          <Link href={`/admin/tools/${tool._id}/edit`} className="font-medium hover:underline">
                            {tool.name}
                          </Link>
                        </td>
                        <td className="p-4 text-[var(--muted)]">
                          {tool.categories?.[0] || 'Uncategorized'}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-[var(--muted)]">No tools yet</div>
              )}
            </div>
          </section>

          {/* Recent Flows */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Flows</h2>
              <Link href="/admin/flows" className="text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center text-[var(--muted)]">Loading...</div>
              ) : recentFlows.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-[var(--surface)]">
                    <tr>
                      <th className="text-left p-4 font-semibold">Title</th>
                      <th className="text-left p-4 font-semibold">Category</th>
                      <th className="text-left p-4 font-semibold">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFlows.map((flow: any) => (
                      <tr key={flow._id} className="border-t border-[var(--border)]">
                        <td className="p-4">
                          <Link href={`/admin/flows/${flow._id}/edit`} className="font-medium hover:underline">
                            {flow.title}
                          </Link>
                        </td>
                        <td className="p-4 text-[var(--muted)]">{flow.category}</td>
                        <td className="p-4 text-[var(--muted)]">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-[var(--muted)]">No flows yet</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
