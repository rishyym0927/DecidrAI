/**
 * AddToStackButton Component
 * Button to add tools to user's AI Stack
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useAiStack, useAddToAiStack, useRemoveFromAiStack } from '@/hooks';
import { Layers, Plus, Check, Loader2, X } from 'lucide-react';

interface AddToStackButtonProps {
    toolId: string;
    toolName: string;
    className?: string;
}

const CATEGORIES = [
    'Writing & Content',
    'Design & Creative',
    'Development',
    'Productivity',
    'Marketing',
    'Research',
    'Communication',
    'Other'
];

export default function AddToStackButton({ 
    toolId,
    toolName,
    className = ''
}: AddToStackButtonProps) {
    const { isSignedIn } = useAuth();
    const { data: aiStack } = useAiStack();
    const addMutation = useAddToAiStack();
    const removeMutation = useRemoveFromAiStack();
    
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [notes, setNotes] = useState('');

    const inStack = aiStack?.data?.some(item => item.toolId === toolId) ?? false;
    const isLoading = addMutation.isPending || removeMutation.isPending;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            return; // Could show sign-in prompt
        }

        if (inStack) {
            removeMutation.mutate(toolId);
        } else {
            setShowModal(true);
        }
    };

    const handleAddToStack = () => {
        if (!selectedCategory) return;
        
        addMutation.mutate(
            { toolId, category: selectedCategory, notes },
            {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedCategory('');
                    setNotes('');
                }
            }
        );
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    inStack
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'border border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-500 dark:border-gray-600 dark:text-gray-300'
                } ${className}`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : inStack ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Layers className="w-4 h-4" />
                )}
                {inStack ? 'In Your Stack' : 'Add to Stack'}
            </button>

            {/* Category Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add to Your AI Stack
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Adding <strong>{toolName}</strong> to your stack
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-2 text-sm rounded-lg border transition ${
                                            selectedCategory === cat
                                                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="How do you use this tool?"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToStack}
                                disabled={!selectedCategory || addMutation.isPending}
                                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {addMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
