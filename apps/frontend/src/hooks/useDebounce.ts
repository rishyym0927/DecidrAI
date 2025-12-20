/**
 * useDebounce Hook
 * Debounces a value with a specified delay
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: Cancel the timer if value changes before delay completes
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Custom hook that returns debounced value and loading state
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400ms)
 * @returns Object with debounced value and isPending state
 */
export function useDebounceWithPending<T>(value: T, delay: number = 400): {
    debouncedValue: T;
    isPending: boolean;
} {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        // If value changed, mark as pending
        if (value !== debouncedValue) {
            setIsPending(true);
        }

        const timer = setTimeout(() => {
            setDebouncedValue(value);
            setIsPending(false);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay, debouncedValue]);

    return { debouncedValue, isPending };
}

export default useDebounce;
