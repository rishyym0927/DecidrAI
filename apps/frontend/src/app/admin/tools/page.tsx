/**
 * Admin Tools Management
 * CRUD operations for AI tools
 */

'use client';

import { useTools } from '@/hooks';

export default function AdminToolsPage() {
  const { data: tools, isLoading } = useTools();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Tools</h1>
        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
          Add New Tool
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Tools Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Map tools */}
            {/* Actions: Edit, Delete, View */}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {/* Pagination controls */}
      </div>
    </div>
  );
}
