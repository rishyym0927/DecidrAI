/**
 * User Profile Page
 * Shows saved tools, flow history, and preferences
 */

'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// Tab type
type ProfileTab = 'saved' | 'history' | 'settings';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<ProfileTab>('saved');

  // Mock data - In production, fetch from backend
  const savedTools = [
    { slug: 'chatgpt', name: 'ChatGPT', tagline: 'Conversational AI', category: 'productivity' },
    { slug: 'notion-ai', name: 'Notion AI', tagline: 'AI workspace', category: 'productivity' },
    { slug: 'github-copilot', name: 'GitHub Copilot', tagline: 'AI pair programmer', category: 'development' },
  ];

  const flowHistory = [
    { id: '1', flowTitle: 'Prepare for Interviews', completedAt: '2024-12-19', toolsRecommended: 4 },
    { id: '2', flowTitle: 'Create Better Content', completedAt: '2024-12-18', toolsRecommended: 6 },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin text-4xl">⚡</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-[var(--muted)] mb-8">
            Please sign in to access your profile, saved tools, and flow history.
          </p>
          <Link
            href="/sign-in"
            className="inline-block px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'saved' as ProfileTab, label: 'Saved Tools', icon: '💾' },
    { key: 'history' as ProfileTab, label: 'Flow History', icon: '📜' },
    { key: 'settings' as ProfileTab, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--background)] border-2 border-[var(--border)]">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || 'Profile picture'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {user?.fullName || user?.firstName || 'User'}
              </h1>
              <p className="text-[var(--muted)]">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          {/* Saved Tools Tab */}
          {activeTab === 'saved' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Tools</h2>
                <span className="text-[var(--muted)]">{savedTools.length} tools</span>
              </div>

              {savedTools.length > 0 ? (
                <div className="space-y-4">
                  {savedTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center justify-between p-6 border border-[var(--border)] rounded-2xl hover:border-[var(--foreground)] transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-bold">{tool.name}</h3>
                        <p className="text-sm text-[var(--muted)]">{tool.tagline}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-[var(--surface)] rounded-full text-xs capitalize">
                          {tool.category}
                        </span>
                        <ConfirmDialog
                          trigger={
                            <span className="text-red-500 hover:text-red-600">Remove</span>
                          }
                          title="Remove Saved Tool?"
                          description={`Are you sure you want to remove "${tool.name}" from your saved tools?`}
                          confirmText="Remove"
                          destructive
                          onConfirm={() => {
                            // TODO: Implement remove from saved
                            console.log('Removing tool:', tool.slug);
                          }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                  <div className="text-6xl mb-4">💾</div>
                  <h3 className="text-xl font-bold mb-2">No Saved Tools</h3>
                  <p className="text-[var(--muted)] mb-6">
                    Save tools you like to access them quickly later
                  </p>
                  <Link
                    href="/tools"
                    className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
                  >
                    Browse Tools
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Flow History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Flow History</h2>
                <span className="text-[var(--muted)]">{flowHistory.length} flows completed</span>
              </div>

              {flowHistory.length > 0 ? (
                <div className="space-y-4">
                  {flowHistory.map((flow) => (
                    <div
                      key={flow.id}
                      className="p-6 border border-[var(--border)] rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{flow.flowTitle}</h3>
                        <span className="text-sm text-[var(--muted)]">
                          {new Date(flow.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--muted)]">
                          {flow.toolsRecommended} tools recommended
                        </span>
                        <Link
                          href={`/discover`}
                          className="text-sm font-medium hover:underline"
                        >
                          Try again →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                  <div className="text-6xl mb-4">📜</div>
                  <h3 className="text-xl font-bold mb-2">No Flow History</h3>
                  <p className="text-[var(--muted)] mb-6">
                    Complete a discovery flow to get personalized recommendations
                  </p>
                  <Link
                    href="/discover"
                    className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
                  >
                    Start Discovery
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Settings</h2>

              <div className="space-y-6">
                {/* Email Preferences */}
                <div className="p-6 border border-[var(--border)] rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Email Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span>Weekly recommendations</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>New tool alerts</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Product updates</span>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>
                  </div>
                </div>

                {/* Account */}
                <div className="p-6 border border-[var(--border)] rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Account</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <span className="text-[var(--muted)]">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Member since</span>
                      <span className="text-[var(--muted)]">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 border border-red-200 dark:border-red-900 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h3>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <ConfirmDialog
                    trigger={
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                        Delete Account
                      </button>
                    }
                    title="Delete Your Account?"
                    description="This action cannot be undone. All your saved tools, flow history, and preferences will be permanently deleted."
                    confirmText="Delete My Account"
                    destructive
                    onConfirm={() => {
                      // TODO: Implement account deletion via Clerk
                      console.log('Deleting account...');
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
