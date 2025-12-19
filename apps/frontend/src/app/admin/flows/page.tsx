/**
 * Admin Flows Management
 * CRUD operations for discovery flows
 */

'use client';

import { useFlows } from '@/hooks';

export default function AdminFlowsPage() {
  const { data: flows, isLoading } = useFlows();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Flows</h1>
        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
          Create New Flow
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search flows..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Flows Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Questions</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Sessions</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Map flows */}
            {/* Actions: Edit, Delete, View, Test */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
