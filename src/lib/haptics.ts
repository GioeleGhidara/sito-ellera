/**
 * Utility to trigger haptic feedback (vibration) on supported devices.
 * Uses the Web Vibration API.
 */
export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator &&
    typeof navigator.vibrate === "function"
  ) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors as it's a non-essential feature
      console.debug("Haptic feedback fail:", e);
    }
  }
};

/**
 * Common vibration patterns
 */
export const HAPTIC_PATTERNS = {
  LIGHT: 10,
  MEDIUM: 20,
  HEAVY: 40,
  SUCCESS: [10, 30, 10],
  ERROR: [50, 100, 50, 100],
  NOTIFICATION: [10, 10, 10],
};
