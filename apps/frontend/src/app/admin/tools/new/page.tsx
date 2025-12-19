/**
 * Admin Tool Create/Edit Page
 * Form for creating or editing a tool
 */

'use client';

import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function AdminToolFormPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    pricing: '',
    features: [],
    tags: [],
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to create/update tool
      showToast.success(isEdit ? 'Tool updated!' : 'Tool created!');
      router.push('/admin/tools');
    } catch (error) {
      showToast.error('Failed to save tool');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        {isEdit ? 'Edit Tool' : 'Create New Tool'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
          
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Tool Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., ChatGPT"
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Slug *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., chatgpt"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description *</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Brief description..."
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Classification</h2>
          
          {/* Category */}
          {/* Tags */}
          {/* Use Cases */}
        </div>

        {/* Pricing */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          {/* Pricing tiers */}
        </div>

        {/* Features */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          {/* Feature list */}
        </div>

        {/* Links */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          {/* Website, docs, etc. */}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
          >
            {isEdit ? 'Update Tool' : 'Create Tool'}
          </button>
        </div>
      </form>
    </div>
  );
}
