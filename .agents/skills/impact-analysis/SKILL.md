---
name: impact-analysis
description: Use before changing anything another part of NR Scholar depends on — backend API calls and response handling, auth/token flow and storage keys, web routes opened by the mobile shell, the WebView bridge, mobile API service or app config. Produces a blast-radius table and stops for developer approval.
---

# Impact analysis — nrscholar-frontend

**This skill ends with a stop.** Present the result and wait for approval before editing.

## Parts to check

| Part | Where | Coupling |
| --- | --- | --- |
| Web app | `src/app/App.tsx` (routes, token from URL/storage), `src/api.ts` (auth, caches), feature screens | Route paths, storage keys, response handling |
| Mobile shell | `mobile/app/practice/webview.tsx` (web paths + token injection), `mobile/app/**` (native screens), `mobile/app/services/api.ts` | Opens web routes, passes the token, calls the same backend |
| Backend | `../nrscholar-backend`: `app/api/endpoints/`, `app/core/security.py` (deployed on Render) | Endpoints, `{ success, message, data }`, auth/refresh, WebSocket messages |
| Deployed app versions | Installed mobile builds keep loading the **production** web URL | Web changes ship instantly to old app versions |

## Workflow

1. **List what changes:** routes, storage keys, token handoff, endpoints/fields used, bridge messages, `WEBAPP_URL`/`BASE_URL`.
2. **Search** both `src/` and `mobile/` for each path, key and endpoint string.
3. **Classify:**
   - 🔴 Breaking: a renamed/removed web route the app opens, a changed storage key or token handoff, a required backend field, a removed bridge message. Old app builds break.
   - 🟡 Additive: a new route, optional field or new message (old builds unaffected).
   - 🟢 Internal: no contract change.
4. **Strategy:** keep old routes as redirects, accept both old and new keys during a transition, deploy the backend first for new fields, and release mobile before removing web fallbacks.
5. **Present and stop.**

## Output

```
## Impact analysis — <change>

| Item | Change | Tier | web | mobile | backend | Strategy |
|------|--------|------|-----|--------|---------|----------|

Release order: …
⏸ Waiting for approval before editing.
```
