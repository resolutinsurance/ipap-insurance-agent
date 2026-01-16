import { atomWithStorage } from "jotai/utils";

/**
 * Creates a Jotai atom with sessionStorage (session-only, cleared when browser closes)
 * This is different from localStorage which persists across browser sessions
 *
 * Uses a custom storage implementation that properly syncs with sessionStorage
 */
export function atomWithSessionStorage<Value>(key: string, initialValue: Value) {
  // Create a custom storage object that properly handles sessionStorage
  const storage = {
    getItem: (key: string, initialValue: Value): Value => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const stored = sessionStorage.getItem(key);
        if (stored === null) {
          return initialValue;
        }
        const parsed = JSON.parse(stored);
        // Ensure we return the parsed value or initialValue if parsing fails
        return parsed !== null && parsed !== undefined ? parsed : initialValue;
      } catch (error) {
        console.error(`Error reading from sessionStorage for key "${key}":`, error);
        return initialValue;
      }
    },
    setItem: (key: string, value: Value): void => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing to sessionStorage for key "${key}":`, error);
        // Ignore errors (e.g., quota exceeded)
      }
    },
    removeItem: (key: string): void => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from sessionStorage for key "${key}":`, error);
      }
    },
  };

  // Use atomWithStorage with our custom storage implementation
  return atomWithStorage<Value>(key, initialValue, storage);
}

import { PAYMENT_VERIFICATION_STORAGE_KEY } from "./payment-verification";

/**
 * Clear payment session data from sessionStorage
 * Called when:
 * - Payment successful
 * - User explicitly cancels
 * - Starting a new payment session
 */
export function clearPaymentSession() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    // Clear the unified payment verification state from sessionStorage
    sessionStorage.removeItem(PAYMENT_VERIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing payment session:", error);
  }
}
