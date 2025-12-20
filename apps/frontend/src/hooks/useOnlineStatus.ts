/**
 * useOnlineStatus Hook
 * Detects browser online/offline status
 */

import { useState, useEffect, useCallback } from 'react';

interface OnlineStatusResult {
    isOnline: boolean;
    isOffline: boolean;
    wasOffline: boolean;
}

export function useOnlineStatus(): OnlineStatusResult {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    const [wasOffline, setWasOffline] = useState(false);

    const handleOnline = useCallback(() => {
        setIsOnline(true);
    }, []);

    const handleOffline = useCallback(() => {
        setIsOnline(false);
        setWasOffline(true);
    }, []);

    useEffect(() => {
        // Set initial state
        if (typeof navigator !== 'undefined') {
            setIsOnline(navigator.onLine);
        }

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [handleOnline, handleOffline]);

    return {
        isOnline,
        isOffline: !isOnline,
        wasOffline,
    };
}

export default useOnlineStatus;
