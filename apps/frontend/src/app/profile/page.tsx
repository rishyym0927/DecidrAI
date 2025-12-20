/**
 * User Profile Page
 * Shows saved tools, AI stack, flow history, and preferences
 */

'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
    useCurrentUser, 
    useSavedTools, 
    useAiStack, 
    useUnsaveTool, 
    useRemoveFromAiStack,
    useUpdateProfile,
    useDeleteAccount,
    useUserInteractions
} from '@/hooks';
import { Loader2, Bookmark, Layers, History, Settings, Trash2, ExternalLink } from 'lucide-react';

// Tab type
type ProfileTab = 'saved' | 'stack' | 'history' | 'settings';

export default function ProfilePage() {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const [activeTab, setActiveTab] = useState<ProfileTab>('saved');

    // Fetch data from backend
    const { data: userData, isLoading: userLoading } = useCurrentUser();
    const { data: savedToolsData, isLoading: savedLoading } = useSavedTools();
    const { data: aiStackData, isLoading: stackLoading } = useAiStack();

    // Mutations
    const unsaveMutation = useUnsaveTool();
    const removeFromStackMutation = useRemoveFromAiStack();
    const updateProfileMutation = useUpdateProfile();
    const deleteAccountMutation = useDeleteAccount();

    // Get user interactions for history
    const { data: interactionsData, isLoading: historyLoading } = useUserInteractions({ limit: 20 });

    // Preferences state
    const [emailNotifications, setEmailNotifications] = useState(
        userData?.data?.preferences?.emailNotifications ?? true
    );

    const savedTools = savedToolsData?.data || [];
    const aiStack = aiStackData?.data || [];

    if (!isLoaded || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
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
                        Please sign in to access your profile, saved tools, and AI stack.
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
        { key: 'saved' as ProfileTab, label: 'Saved Tools', icon: <Bookmark className="w-4 h-4" />, count: savedTools.length },
        { key: 'stack' as ProfileTab, label: 'AI Stack', icon: <Layers className="w-4 h-4" />, count: aiStack.length },
        { key: 'history' as ProfileTab, label: 'History', icon: <History className="w-4 h-4" /> },
        { key: 'settings' as ProfileTab, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];

    const handlePreferenceChange = (key: string, value: boolean) => {
        updateProfileMutation.mutate({
            preferences: { [key]: value }
        });
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--background)] border-2 border-[var(--border)]">
                            {clerkUser?.imageUrl ? (
                                <Image
                                    src={clerkUser.imageUrl}
                                    alt={clerkUser.fullName || 'Profile picture'}
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
                                {clerkUser?.fullName || clerkUser?.firstName || 'User'}
                            </h1>
                            <p className="text-[var(--muted)]">
                                {clerkUser?.primaryEmailAddress?.emailAddress}
                            </p>
                            {userData?.data?.profile?.experienceLevel && (
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full capitalize">
                                    {userData.data.profile.experienceLevel}
                                </span>
                            )}
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
                                className={`py-4 font-medium transition-colors relative flex items-center gap-2 ${
                                    activeTab === tab.key
                                        ? 'text-[var(--foreground)]'
                                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
                                        {tab.count}
                                    </span>
                                )}
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

                            {savedLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : savedTools.length > 0 ? (
                                <div className="space-y-4">
                                    {savedTools.map((saved) => (
                                        <div
                                            key={saved.toolId}
                                            className="flex items-center justify-between p-6 border border-[var(--border)] rounded-2xl hover:border-[var(--foreground)] transition-colors"
                                        >
                                            <div className="flex-1">
                                                <Link href={`/tools/${(saved as any).tool?.slug || saved.toolId}`}>
                                                    <h3 className="text-lg font-bold hover:underline">
                                                        {(saved as any).tool?.name || 'Unknown Tool'}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-[var(--muted)]">
                                                    {(saved as any).tool?.tagline || ''}
                                                </p>
                                                {saved.notes && (
                                                    <p className="mt-2 text-sm text-gray-500 italic">
                                                        Note: {saved.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-[var(--muted)]">
                                                    Saved {new Date(saved.savedAt).toLocaleDateString()}
                                                </span>
                                                <ConfirmDialog
                                                    trigger={
                                                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    }
                                                    title="Remove Saved Tool?"
                                                    description={`Are you sure you want to remove this tool from your saved list?`}
                                                    confirmText="Remove"
                                                    destructive
                                                    onConfirm={() => {
                                                        unsaveMutation.mutate(saved.toolId);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                                    <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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

                    {/* AI Stack Tab */}
                    {activeTab === 'stack' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Your AI Stack</h2>
                                    <p className="text-sm text-[var(--muted)]">
                                        Your personal collection of AI tools organized by category
                                    </p>
                                </div>
                                <span className="text-[var(--muted)]">{aiStack.length} tools</span>
                            </div>

                            {stackLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : aiStack.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Group by category */}
                                    {Object.entries(
                                        aiStack.reduce((acc, item) => {
                                            acc[item.category] = acc[item.category] || [];
                                            acc[item.category].push(item);
                                            return acc;
                                        }, {} as Record<string, typeof aiStack>)
                                    ).map(([category, items]) => (
                                        <div key={category} className="border border-[var(--border)] rounded-2xl overflow-hidden">
                                            <div className="px-6 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
                                                <h3 className="font-semibold">{category}</h3>
                                            </div>
                                            <div className="divide-y divide-[var(--border)]">
                                                {items.map((item) => (
                                                    <div key={item.toolId} className="flex items-center justify-between p-4">
                                                        <div className="flex-1">
                                                            <Link href={`/tools/${(item as any).tool?.slug || item.toolId}`}>
                                                                <h4 className="font-medium hover:underline">
                                                                    {(item as any).tool?.name || 'Unknown Tool'}
                                                                </h4>
                                                            </Link>
                                                            {item.notes && (
                                                                <p className="text-sm text-gray-500">{item.notes}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/tools/${(item as any).tool?.slug || item.toolId}`}
                                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                                            >
                                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                                            </Link>
                                                            <ConfirmDialog
                                                                trigger={
                                                                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                }
                                                                title="Remove from Stack?"
                                                                description="Remove this tool from your AI stack?"
                                                                confirmText="Remove"
                                                                destructive
                                                                onConfirm={() => {
                                                                    removeFromStackMutation.mutate(item.toolId);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                                    <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-bold mb-2">Build Your AI Stack</h3>
                                    <p className="text-[var(--muted)] mb-6">
                                        Curate your personal collection of AI tools organized by how you use them
                                    </p>
                                    <Link
                                        href="/tools"
                                        className="inline-block px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
                                    >
                                        Explore Tools
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Activity History</h2>
                            
                            {historyLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : interactionsData?.data && interactionsData.data.length > 0 ? (
                                <div className="space-y-4">
                                    {interactionsData.data.map((interaction: any) => (
                                        <div
                                            key={interaction._id}
                                            className="flex items-start gap-4 p-4 border border-[var(--border)] rounded-xl"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 bg-[var(--surface)] rounded-full flex items-center justify-center">
                                                {interaction.eventType === 'view' && '👁️'}
                                                {interaction.eventType === 'click' && '👆'}
                                                {interaction.eventType === 'save' && '💾'}
                                                {interaction.eventType === 'compare' && '⚖️'}
                                                {interaction.eventType === 'flow_start' && '🚀'}
                                                {interaction.eventType === 'flow_complete' && '✅'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium capitalize">
                                                    {interaction.eventType.replace('_', ' ')}
                                                </p>
                                                <p className="text-sm text-[var(--muted)]">
                                                    {new Date(interaction.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-[var(--border)] rounded-2xl">
                                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-bold mb-2">No Activity Yet</h3>
                                    <p className="text-[var(--muted)] mb-6">
                                        Your tool views, saves, and flow completions will appear here
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
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span>Email notifications</span>
                                            <input
                                                type="checkbox"
                                                checked={emailNotifications}
                                                onChange={(e) => {
                                                    setEmailNotifications(e.target.checked);
                                                    handlePreferenceChange('emailNotifications', e.target.checked);
                                                }}
                                                className="w-5 h-5"
                                            />
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
                                                {clerkUser?.primaryEmailAddress?.emailAddress}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Member since</span>
                                            <span className="text-[var(--muted)]">
                                                {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Role</span>
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm capitalize">
                                                {userData?.data?.role || 'user'}
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
                                            <button 
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                                disabled={deleteAccountMutation.isPending}
                                            >
                                                {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                                            </button>
                                        }
                                        title="Delete Your Account?"
                                        description="This action cannot be undone. All your saved tools, AI stack, and preferences will be permanently deleted."
                                        confirmText="Delete My Account"
                                        destructive
                                        onConfirm={() => {
                                            deleteAccountMutation.mutate();
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

