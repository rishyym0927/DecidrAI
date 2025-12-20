/**
 * OfflineIndicator Component
 * Shows a banner when the user loses internet connection
 */

'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const { isOffline, wasOffline, isOnline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  // Show "reconnected" message briefly when coming back online
  useEffect(() => {
    if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline]);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-medium shadow-lg transition-all ${
        isOffline
          ? 'bg-red-500 text-white'
          : 'bg-green-500 text-white'
      }`}
      role="alert"
      aria-live="polite"
    >
      {isOffline ? (
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <span>You're offline. Some features may be unavailable.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xl">✓</span>
          <span>You're back online!</span>
        </div>
      )}
    </div>
  );
}
