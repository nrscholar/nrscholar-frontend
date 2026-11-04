/**
 * Mobile Number Formatter Utility
 * Formats Indian 10-digit mobile numbers as "XXXXX XXXXX" (5-5 grouping)
 * while ensuring clean 10-digit raw strings are maintained in application state and API payloads.
 */

/**
 * Strips non-digits and formats into "XXXXX XXXXX" for UI display
 */
export function formatMobileDisplay(val: string | number | undefined | null): string {
  if (!val) return "";
  const clean = String(val).replace(/\D/g, "").slice(0, 10);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return clean;
}

/**
 * Strips all non-digits, strips leading +91/91 country code if 12 digits, and limits to 10 digits
 */
export function cleanMobileDigits(val: string | number | undefined | null): string {
  if (!val) return "";
  let digits = String(val).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

/**
 * Masks a 10-digit mobile number so the first 6 digits are displayed as 'X'
 * and the last 4 digits remain visible (e.g. "XXXXXX1234").
 */
export function maskMobileDisplay(val: string | number | undefined | null): string {
  if (!val) return "";
  const clean = cleanMobileDigits(val);
  if (clean.length === 10) {
    return `XXXXXX${clean.slice(6)}`;
  }
  if (clean.length > 4) {
    return `${"X".repeat(clean.length - 4)}${clean.slice(-4)}`;
  }
  return clean;
}

export const maskMobile = maskMobileDisplay;

/**
 * Parses user input from a mobile text field:
 * - Strips non-digits and handles country codes
 * - Handles backspacing over the space separator at index 5 without getting stuck
 * - Computes the precise caret position to prevent cursor jumping
 */
export function parseMobileInput(
  inputVal: string,
  previousRaw: string = "",
  cursorPos: number = inputVal.length
): { clean: string; formatted: string; nextCursor: number } {
  // Count raw digits before the current caret position
  const digitsBeforeCursor = inputVal.slice(0, cursorPos).replace(/\D/g, "").length;
  let digits = cleanMobileDigits(inputVal);

  const prevFormatted = formatMobileDisplay(previousRaw);
  let targetDigitCount = digitsBeforeCursor;

  // If user hit backspace directly on the space separator (cursor at index 5)
  if (
    prevFormatted.length === inputVal.length + 1 &&
    inputVal === prevFormatted.replace(" ", "") &&
    cursorPos === 5
  ) {
    // Delete the 5th digit
    digits = (previousRaw.slice(0, 4) + previousRaw.slice(5)).slice(0, 10);
    targetDigitCount = 4;
  }

  const clean = digits.slice(0, 10);
  const formatted = formatMobileDisplay(clean);
  // If targetDigitCount <= 5, cursor is targetDigitCount; if > 5, +1 for the space at index 5
  const nextCursor = targetDigitCount <= 5 ? targetDigitCount : targetDigitCount + 1;

  return {
    clean,
    formatted,
    nextCursor: Math.min(nextCursor, formatted.length)
  };
}

