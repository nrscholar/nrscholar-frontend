---
name: refactoring
description: Use when restructuring nrscholar-frontend code without changing behavior — splitting large screens (500–1,350 lines) into hooks/components, moving apiFetch calls into feature api modules, replacing hex classes with theme tokens, removing any, extracting duplicated headers/cards, introducing storage-key and route constants.
---

# Refactoring — nrscholar-frontend

## Typical targets

`MissionPlayScreen` (1,355 lines), `ParentSettings` (1,123), `HomeScreen` (901), `ParentDashboardScreen`, `ParentReportScreen`, `BossBattleScreen`, `ChapterQuestionsScreen`. Also duplicated header/notification/XP UI across screens, `apiFetch` inside screens, `localStorage` string keys, arbitrary hex classes, and `any`.

## Inspect first

1. Every importer/route of what you'll move (`App.tsx`, the mobile WebView paths).
2. The current behavior: requests and their timing, caches touched, timers, animations, translations, role checks.
3. The visual result. Refactors must look identical.

## Workflow

1. Define the scope in one sentence and list the files. Agree on it with the developer if it's broad.
2. Small steps, lint + build green after each: extract a hook → extract components → move API calls into `api.ts` → add types.
3. Keep behavior identical: same endpoints, cache clearing, effects and cleanup, texts, routes, rewards and scoring logic.
4. Hex → token only when visually identical. Otherwise list it for the designer.
5. Give the developer the screens to compare (web + WebView).

## Rules

- Zero behavior or visual change. Bugs found → note them, and fix them separately.
- Move toward the documented feature structure (`pages/`, `components/`, `hooks/`, `api.ts`, `types.ts`). Don't invent another.
- One screen or one concern per PR.

## Output

The structural change, the evidence that behavior is unchanged, the screens to check, and follow-ups.
