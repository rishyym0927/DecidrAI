/**
 * Admin Tool Create Page
 * Form to create a new tool
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { showToast } from '@/lib/toast';
import api from '@/lib/axios';

interface ToolFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  long_description: string;
  website_url: string;
  logo_url: string;
  categories: string[];
  pricing: {
    model: 'free' | 'freemium' | 'paid' | 'enterprise';
    starting_price: number;
  };
  learning_curve: 'low' | 'medium' | 'high';
  has_api: boolean;
  platforms: string[];
  use_cases: string[];
  best_for: string[];
  problems_solved: string[];
}

const initialFormData: ToolFormData = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  long_description: '',
  website_url: '',
  logo_url: '',
  categories: [],
  pricing: {
    model: 'freemium',
    starting_price: 0,
  },
  learning_curve: 'low',
  has_api: false,
  platforms: ['web'],
  use_cases: [],
  best_for: [],
  problems_solved: [],
};

const categoryOptions = [
  'productivity', 'writing', 'development', 'marketing', 
  'design', 'video', 'audio', 'collaboration', 'research'
];

const platformOptions = ['web', 'desktop', 'mobile', 'api'];

export default function AdminToolCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ToolFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCaseInput, setUseCaseInput] = useState('');
  const [bestForInput, setBestForInput] = useState('');
  const [problemInput, setProblemInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('pricing.')) {
      const pricingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [pricingField]: pricingField === 'starting_price' ? Number(value) : value,
        },
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const addToList = (
    field: 'use_cases' | 'best_for' | 'problems_solved',
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    setValue('');
  };

  const removeFromList = (field: 'use_cases' | 'best_for' | 'problems_solved', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.tagline) {
      showToast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post('/admin/tools', formData);
      showToast.success('Tool created successfully!');
      router.push('/admin/tools');
    } catch (error: any) {
      showToast.error(error.message || 'Failed to create tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
            <Link href="/admin" className="hover:underline">Admin</Link>
            <span>/</span>
            <Link href="/admin/tools" className="hover:underline">Tools</Link>
            <span>/</span>
            <span>New</span>
          </div>
          <h1 className="text-3xl font-bold">Add New Tool</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl">
          {/* Basic Info */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                  placeholder="e.g., ChatGPT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                    placeholder="chatgpt"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)]"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                  placeholder="Short description in one sentence"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Long Description</label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                  placeholder="Detailed description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Website URL</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Logo URL</label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-4 py-2 rounded-full capitalize transition-colors ${
                    formData.categories.includes(cat)
                      ? 'bg-[var(--foreground)] text-[var(--background)]'
                      : 'border border-[var(--border)] hover:border-[var(--foreground)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Pricing Model</label>
                <select
                  name="pricing.model"
                  value={formData.pricing.model}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Starting Price ($/month)</label>
                <input
                  type="number"
                  name="pricing.starting_price"
                  value={formData.pricing.starting_price}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Learning Curve</label>
                <select
                  name="learning_curve"
                  value={formData.learning_curve}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="has_api"
                  checked={formData.has_api}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="font-semibold">Has API</label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformToggle(platform)}
                      className={`px-4 py-2 rounded-full capitalize transition-colors ${
                        formData.platforms.includes(platform)
                          ? 'bg-[var(--foreground)] text-[var(--background)]'
                          : 'border border-[var(--border)] hover:border-[var(--foreground)]'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Use Cases</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={useCaseInput}
                onChange={(e) => setUseCaseInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('use_cases', useCaseInput, setUseCaseInput))}
                className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
                placeholder="Add a use case"
              />
              <button
                type="button"
                onClick={() => addToList('use_cases', useCaseInput, setUseCaseInput)}
                className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.use_cases.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-[var(--surface)] rounded-full flex items-center gap-2">
                  {item}
                  <button type="button" onClick={() => removeFromList('use_cases', i)} className="text-red-500">×</button>
                </span>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Tool'}
            </button>
            <Link
              href="/admin/tools"
              className="px-8 py-4 border-2 border-[var(--border)] rounded-full font-semibold hover:border-[var(--foreground)] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
