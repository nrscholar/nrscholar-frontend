import { useEffect } from "react";

// Global counter to gracefully handle stacked/nested modals
let lockCount = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";
let originalPaddingRight = "";

/**
 * Locks background body scrolling.
 * Safe for SSR and handles desktop scrollbar compensation.
 */
export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;

  lockCount++;
  if (lockCount === 1) {
    const body = document.body;
    const html = document.documentElement;

    originalBodyOverflow = body.style.overflow;
    originalHtmlOverflow = html.style.overflow;
    originalPaddingRight = body.style.paddingRight;

    // Prevent layout shift on desktop when scrollbar disappears
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
  }
}

/**
 * Unlocks background body scrolling once all active modals are closed.
 */
export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const body = document.body;
    const html = document.documentElement;

    body.style.overflow = originalBodyOverflow;
    html.style.overflow = originalHtmlOverflow;
    body.style.paddingRight = originalPaddingRight;
  }
}

/**
 * React hook to lock body & background scrolling while a modal/popup is open.
 * Automatically cleans up on unmount or when `isLocked` becomes false.
 */
export function useLockBodyScroll(isLocked: boolean = true): void {
  useEffect(() => {
    if (!isLocked) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}

export default useLockBodyScroll;
