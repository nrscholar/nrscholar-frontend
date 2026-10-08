---
name: api-integration
description: Use when connecting nrscholar-frontend (web or mobile) to a backend endpoint — adding or changing calls, request/response types, loading/error handling, caching or token behavior.
---

# API integration — nrscholar-frontend

## Inspect first

1. The endpoint contract in `../nrscholar-backend/app/api/endpoints/<area>.py` (or from the backend developer if the folder is missing): method, path, auth, body, `{ success, message, data }` shape, error cases. Don't guess.
2. Web: `src/api.ts` (`apiFetch`, caches, auth helpers) and the feature's `api.ts`/`types.ts` if present. Mobile: `mobile/app/services/api.ts`.
3. Other screens already calling the same endpoint. Reuse their function or hook.

## Workflow (web)

1. **Types** in `src/features/<feature>/types.ts`, using `ApiResult<T> = { success: boolean; message?: string; data: T }`.
2. **Function** in `src/features/<feature>/api.ts`: `const response = await apiFetch("/api/…", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return response.json();`.
3. **Hook** `useX()` returning `{ data, isLoading, error, reload }`, or `{ submit, isSubmitting, error }` for mutations, ignoring stale responses after unmount.
4. **Screen** renders loading/error (translated + retry)/empty/data. Disable buttons while submitting.
5. **Caches:** if the endpoint changes the user (XP, coins, profile) or the parent report, make sure the existing caches are cleared. Non-GET requests through `apiFetch` already clear both.
6. Verify with lint + build.

## Workflow (mobile)

Add a typed function to `mobile/app/services/api.ts` (or a sibling service), use `BASE_URL` and the token helpers, and handle errors with user-facing messages.

## Rules

- Never raw `fetch`/axios to the backend from screens. Never hardcode hosts in screens.
- Don't duplicate token refresh/logout. Don't add new `localStorage` caches.
- Encode query params with `URLSearchParams`.
- Contract changes (new required field, renamed field) → `impact-analysis`, with the backend change first.

## Output

The contract consumed, files changed, caching impact, and checks run.
