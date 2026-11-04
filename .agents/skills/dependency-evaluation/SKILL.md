---
name: dependency-evaluation
description: Use before adding, upgrading or replacing any package in nrscholar-frontend (web package.json or mobile/package.json), or when someone proposes a new library. Decides whether it is justified (bundle, low-end devices, Expo compatibility, child-privacy) and produces a recommendation for approval.
---

# Dependency evaluation — nrscholar-frontend

## Already installed

| Need | Web (`/`) | Mobile (`mobile/`) |
| --- | --- | --- |
| Routing | `react-router-dom` | `expo-router` |
| State | React state (Zustand installed, unused) | `zustand` |
| HTTP | `apiFetch` (fetch) | `services/api.ts` (fetch) |
| Animation | `framer-motion`, `lottie-react`, `@tsparticles/*` | React Native Animated / Expo libs |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` | — |
| i18n | `i18next`, `react-i18next`, language detector | — |
| Icons | `lucide-react` | `@expo/vector-icons` |
| PDF | `react-pdf` | — |
| Secure storage / WebView | — | `expo-secure-store`, `react-native-webview` |

## Evaluate (only if nothing existing fits)

Need · overlap · bundle size and lazy-loadability · low-end Android/WebView performance · **Expo SDK 54 compatibility** (use `npx expo install` versions for mobile) · React 18 (web) / React 19 (mobile) compatibility · maintenance and license · advisories · **child privacy** (no tracking/ads SDKs, no data sent to third parties) · exit cost.

## Rules

- Web uses npm scripts with **both `package-lock.json` and `pnpm-lock.yaml` present**. Ask which manager is canonical before touching lockfiles. Mobile uses **yarn** (`yarn.lock`).
- Never install without explicit approval. Commit the lockfile with its `package.json`.
- Heavy libraries are lazy-loaded on the screens that use them.

## Output

```
Recommendation: Use existing <x> | Small helper | Add <package>@<version> (web|mobile)
Need / Alternatives / Bundle & device impact / Privacy / Risks
```
