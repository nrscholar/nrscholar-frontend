---
name: security-review
description: Use when reviewing nrscholar-frontend for security and child privacy — tokens and sessions, the parental gate and parent-only screens, screen-time limits, personal data of children, camera/scan uploads, the WebView bridge and token injection, external links, analytics, subscriptions, env config.
---

# Security review — nrscholar-frontend

Rules: the `security-and-child-privacy` and `mobile-and-webview` rules.

## Workflow

Check each category. Report file:line, a scenario, the impact and a fix.

1. **Parental controls:** can a child reach parent screens (settings, subscription, reports) through any route, deep link or WebView path without the gate? Can screen-time limits be bypassed?
2. **Tokens:** storage locations (web `localStorage`, device SecureStore), clearing on logout, **tokens in URLs** (`?token=`), unescaped token injection into WebView JS.
3. **Child data:** what's collected, displayed, cached (`userData` in `localStorage`), logged, or sent anywhere other than our backend. Third-party SDKs/analytics.
4. **Rendering:** `dangerouslySetInnerHTML`, AI chat or content rendered as HTML.
5. **WebView:** navigation allow-list, `onMessage` validation, `javaScriptEnabled` scope, `WEBAPP_URL` constants.
6. **Uploads/camera (Scan & Learn):** permissions requested on demand, type and size limits, destination.
7. **Secrets/config:** nothing secret in `VITE_*`, `app.json` or source. Hardcoded hosts.
8. **Subscriptions:** entitlement decided by the backend, not the client.
9. **Dependencies:** new or outdated packages with known advisories.

## Rules

Report only what you can support with a scenario. Mark uncertain items "needs verification". Never print secrets you find. Report their location only.

## Output

```
## Security & privacy review — <scope>
Risk: High | Medium | Low
🔴 … path:line. Scenario … Impact … Fix …
🟡 …
✅ Checked: …
⚠️ Needs backend/device verification: …
```
