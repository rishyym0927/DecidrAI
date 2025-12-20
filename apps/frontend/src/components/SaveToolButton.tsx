/**
 * SaveToolButton Component
 * Button to save/unsave tools to user's saved list
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSavedTools, useSaveTool, useUnsaveTool } from '@/hooks';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';

interface SaveToolButtonProps {
    toolId: string;
    variant?: 'icon' | 'button';
    className?: string;
}

export default function SaveToolButton({ 
    toolId, 
    variant = 'icon',
    className = ''
}: SaveToolButtonProps) {
    const { isSignedIn } = useAuth();
    const { data: savedTools } = useSavedTools();
    const saveMutation = useSaveTool();
    const unsaveMutation = useUnsaveTool();
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);

    const isSaved = savedTools?.data?.some(saved => saved.toolId === toolId) ?? false;
    const isLoading = saveMutation.isPending || unsaveMutation.isPending;

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            setShowSignInPrompt(true);
            setTimeout(() => setShowSignInPrompt(false), 2000);
            return;
        }

        if (isSaved) {
            unsaveMutation.mutate(toolId);
        } else {
            saveMutation.mutate({ toolId });
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isSaved 
                        ? 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20' 
                        : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${className}`}
                title={isSaved ? 'Remove from saved' : 'Save tool'}
                aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSaved ? (
                    <BookmarkCheck className="w-5 h-5" />
                ) : (
                    <Bookmark className="w-5 h-5" />
                )}
                {showSignInPrompt && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        Sign in to save
                    </span>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSaved
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 dark:border-gray-600 dark:text-gray-300'
            } ${className}`}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
                <BookmarkCheck className="w-4 h-4" />
            ) : (
                <Bookmark className="w-4 h-4" />
            )}
            {isSaved ? 'Saved' : 'Save'}
        </button>
    );
}
