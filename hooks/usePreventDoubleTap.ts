import { useCallback, useRef } from "react";

const DEFAULT_DELAY_MS = 600;

// biome-ignore lint/suspicious/noExplicitAny: generic constraint requires any for callback variance.
export function usePreventDoubleTap<T extends (...args: any[]) => any>(
  handler: T,
  delay = DEFAULT_DELAY_MS
): (...args: Parameters<T>) => void {
  const lastInvokedRef = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastInvokedRef.current < delay) {
        return;
      }
      lastInvokedRef.current = now;
      handler(...args);
    },
    [handler, delay]
  );
}
