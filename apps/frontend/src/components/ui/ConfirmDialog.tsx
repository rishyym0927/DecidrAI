/**
 * ConfirmDialog Component
 * Reusable confirmation dialog for destructive actions
 */

'use client';

import { useState, ReactNode } from 'react';

interface ConfirmDialogProps {
  /** Trigger element that opens the dialog */
  trigger: ReactNode;
  /** Dialog title */
  title: string;
  /** Dialog description/warning message */
  description: string;
  /** Confirm button text (default: "Confirm") */
  confirmText?: string;
  /** Cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Whether the action is destructive (shows red button) */
  destructive?: boolean;
  /** Callback when user confirms */
  onConfirm: () => void | Promise<void>;
  /** Optional callback when user cancels */
  onCancel?: () => void;
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      {/* Trigger */}
      <span onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {/* Dialog Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            className="relative z-10 w-full max-w-md bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Content */}
            <div className="p-6">
              <h2
                id="confirm-dialog-title"
                className="text-xl font-bold mb-2"
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-description"
                className="text-[var(--muted)]"
              >
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  destructive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-80'
                }`}
              >
                {isLoading ? 'Please wait...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
