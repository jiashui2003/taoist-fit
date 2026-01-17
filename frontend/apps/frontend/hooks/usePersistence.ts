import { useEffect, useRef, useState } from 'react';

/**
 * React Hook for automatic data persistence
 * Implements debouncing to avoid excessive writes
 */
export function usePersistence<T>(
    key: string,
    value: T,
    saveFunction: (key: string, value: T) => Promise<void>,
    debounceMs: number = 1000
): void {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const previousValueRef = useRef<T>(value);

    useEffect(() => {
        // Skip initial render
        if (previousValueRef.current === value) {
            previousValueRef.current = value;
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(async () => {
            try {
                await saveFunction(key, value);
                console.log(`💾 Saved ${key}`);
            } catch (error) {
                console.error(`❌ Failed to persist ${key}:`, error);
            }
        }, debounceMs);

        previousValueRef.current = value;

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [key, value, saveFunction, debounceMs]);
}

/**
 * Hook for online/offline status detection
 */
export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            console.log('🌐 网络已连接');
        };

        const handleOffline = () => {
            setIsOnline(false);
            console.log('📵 网络已断开');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
