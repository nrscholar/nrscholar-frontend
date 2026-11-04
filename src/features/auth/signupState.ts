/**
 * Multi-Step Signup Form State Persistence Helper
 * 
 * Persists intermediate signup form data in sessionStorage so that navigating back
 * via either the in-app back buttons or the device hardware back button does NOT
 * lose previously entered information.
 */

export interface SignupFormData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  childName: string;
  board: string;
  selectedClass: string;
  dob: string;
  gender: string;
  schoolName: string;
  age?: string;
}

const STORAGE_KEY = "nrscholar_signup_state";

export function getSignupState(): Partial<SignupFormData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSignupState(data: Partial<SignupFormData>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSignupState();
    const updated = { ...current, ...data };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearSignupState(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

