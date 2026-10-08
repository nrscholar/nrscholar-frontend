# AGENTS.md — nrscholar-frontend

Instructions for every AI coding assistant in this repository (Antigravity, Cursor, GitHub Copilot,
Claude Code via `CLAUDE.md`, Codex, …). Human developers: see [.agents/README.md](.agents/README.md).

## Project

**NR Scholar**, a learning app for **children and their parents** (missions, battles, weekly tests,
textbooks, rewards, parent reports, and a parental gate). Two apps in one repo:

| Part | Path | Stack |
| --- | --- | --- |
| Web app (deployed on Vercel, also shown inside the mobile WebView) | `src/` | React 18 · TypeScript · Vite 5 · Tailwind 3 · React Router 7 · i18next (en/hi/gu) · framer-motion · three.js |
| Mobile shell | `mobile/` | Expo 54 · expo-router · React Native 0.81 · Zustand · react-native-webview |

The backend is a separate repo, called via `/api/...` (dev proxy → `127.0.0.1:5000`).

```sh
npm install && npm run dev     # web on :3000
npm run lint && npm run build  # web checks (tsc -b + vite build)
cd mobile && yarn && yarn start   # Expo
cd mobile && yarn lint            # mobile checks
node .agents/sync.mjs             # regenerate tool copies after editing .agents/
```

## Non-negotiables

1. **Inspect before writing. Reuse before creating:** `apiFetch` and auth helpers (`src/api.ts`), `Layout`, shared characters/animations, existing locale keys, mobile `services/api.ts`. No new dependency without approval.
2. **Web structure:** screens in `src/features/<feature>/pages/<Name>Screen.tsx`. New logic goes in feature `api.ts` / `hooks/` / `components/` / `types.ts`, not in giant screens. Heavy screens are lazy.
3. **Children's safety:** never weaken the parental gate, parent-only routes or screen-time limits. Collect and share only the data needed. No third-party tracking.
4. **Contracts:** web routes opened by the mobile WebView, the token handoff, storage keys and API shapes are shared between `src/`, `mobile/` and the backend. Use the `impact-analysis` skill and **wait for developer approval before editing**.
5. **UI:** Tailwind theme tokens (no new hex classes), mobile-first (360px, WebView), loading/error/empty states, `t("snake_case_key")` with en/hi/gu.
6. **Code:** no new `any`, typed API results `{ success, message, data }`, full-word names, constants for storage keys and routes, effects cleaned up. Style: double quotes, semicolons, 2 spaces.
7. **Minimal scope:** no unrelated edits, no refactors inside fixes, rewards/XP/scoring logic preserved.
8. **Safety:** never touch `.env*`, never run EAS builds or submits, never commit or push unless asked.
9. **Legacy ≠ standard:** don't copy old patterns (inline fetching, hex colors, `any`, hardcoded English).

## Rules (`.agents/rules/`)

| Rule | Loaded |
| --- | --- |
| [ai-behavior](.agents/rules/ai-behavior.md) | always |
| [coding-standards](.agents/rules/coding-standards.md) | always |
| [architecture](.agents/rules/architecture.md) | `src/**` |
| [api-and-data](.agents/rules/api-and-data.md) | `src/api.ts`, features, app, components |
| [ui-and-styling](.agents/rules/ui-and-styling.md) | `src/**/*.tsx`, styles, Tailwind config |
| [i18n](.agents/rules/i18n.md) | `src/**/*.tsx`, `src/locales/**` |
| [mobile-and-webview](.agents/rules/mobile-and-webview.md) | `mobile/**`, `App.tsx`, `api.ts` |
| [security-and-child-privacy](.agents/rules/security-and-child-privacy.md) | on demand: auth, parental gate, child data, bridge |
| [performance](.agents/rules/performance.md) | on demand: 3D, animations, heavy screens |
| [testing-and-verification](.agents/rules/testing-and-verification.md) | on demand: before calling work done |
| [git-and-pull-requests](.agents/rules/git-and-pull-requests.md) | on demand: branches, commits, PRs |

## Skills (`.agents/skills/`)

`feature-development` · `bug-fixing` · `debugging` · `refactoring` · `api-integration` ·
`ui-component-development` · `translations` · `code-review` · `testing` ·
`performance-optimization` · `security-review` · `documentation` · `git-pr-preparation` ·
`dependency-evaluation` · `impact-analysis`

When a task matches a skill, follow its `SKILL.md`.
