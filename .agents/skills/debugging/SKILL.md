---
name: debugging
description: Use when the cause of a nrscholar-frontend problem is unknown — white screens, unexpected logouts, works in browser but not in the app WebView, freezes or crashes on heavy screens, intermittent data issues, Expo build/runtime errors.
---

# Debugging — nrscholar-frontend

## Inspect first

1. Evidence: console errors, the failing request (status, `success`, `message`), the route, the role, the device/WebView, the app version.
2. Global behavior that affects every screen:
   - `src/api.ts`: token refresh, `clearAuthSession`, `force-logout`, the 30s timeout, the fake 503 on network errors, the 10-minute caches.
   - `src/app/App.tsx`: auth handler, token from the URL/`localStorage`, screen-time tracker, child switcher, lazy routes.
   - `mobile/app/practice/webview.tsx`: URL + `?token=`, injected JS, `WEBAPP_URL` (production Vercel even in dev).
   - `mobile/app/services/api.ts`: `BASE_URL` (Render backend), SecureStore tokens.
3. Recent commits on the path.

## Workflow

1. State the symptom precisely: steps, expected, actual, frequency, environment.
2. Rank hypotheses with confirming/refuting evidence.
3. Test cheaply: read the code path, check effect dependencies and cleanup, check cache invalidation, check which environment URL is used. With the developer: browser DevTools, Chrome `chrome://inspect` for the Android WebView, Safari Web Inspector for iOS, Expo dev tools/logs.
4. Narrow to the cause that explains all evidence (file:line).
5. Hand off to `bug-fixing`. Remove temporary logs.

## Common causes here

- The WebView loads production web code while the app talks to another backend (environment mismatch).
- A cached `userData` with an old shape after a release.
- three.js/particles/Lottie not disposed → memory growth → WebView crash after a few visits.
- A long-lived `setInterval` (screen-time, timers) running in several mounted copies.
- Render (free tier) backend cold starts look like timeouts (30s abort).

## Output

Symptom → hypotheses (confirmed/rejected) → root cause at file:line → recommended fix and its risk.
