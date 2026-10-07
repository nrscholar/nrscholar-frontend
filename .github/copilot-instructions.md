# Copilot instructions — nrscholar-frontend

Read and follow [AGENTS.md](../AGENTS.md). Path-specific rules are in `.github/instructions/`
(generated from `.agents/rules/`). Skills are in `.agents/skills/`.

Essentials, for surfaces that only read this file (for example Copilot code review):

- NR Scholar is a learning app for **children and parents**. Never weaken the parental gate, parent-only routes or screen-time limits. No new personal-data collection or third-party tracking.
- Web (`src/`): React 18, TypeScript, Vite, Tailwind 3, React Router 7, i18next. Mobile (`mobile/`): Expo 54, expo-router, React Native, Zustand, WebView.
- Backend calls go through `apiFetch` (`src/api.ts`). It handles the token, refresh, logout (`force-logout`) and the timeout, and returns a fake 503 response when offline. New code puts calls in a feature `api.ts` + a `useX` hook, not inside screens. Responses are `{ success, message, data }`.
- Screens: `src/features/<feature>/pages/<Name>Screen.tsx`. Keep them under ~400 lines. Lazy-load heavy screens (3D, battles, PDF).
- Tailwind theme tokens from `tailwind.config.js` (`primary`, `surface`, `on-surface`, …). No new `bg-[#hex]` classes. Mobile-first, works in the WebView.
- All visible text via `t("snake_case_key")` with entries in `src/locales/{en,hi,gu}.json`.
- No new `any`, no `console.log`, no empty `catch`. Constants for storage keys and routes. Double quotes, semicolons.
- Web routes opened by `mobile/app/practice/webview.tsx` and the token handoff are a contract with the mobile app. Change both together.
- `.env` files are off limits.
