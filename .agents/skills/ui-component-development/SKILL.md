---
name: ui-component-development
description: Use when creating or changing UI in nrscholar-frontend — kid- and parent-facing screens, cards, modals, game/quiz UI, animations, characters, native Expo screens — enforcing theme tokens, mobile-first layout, translations, accessibility and the four UI states.
---

# UI component development — nrscholar-frontend

## Inspect first

1. The `ui-and-styling` rule (web) or the `mobile-and-webview` rule (native).
2. Existing pieces: `src/components/` (`DragonCharacter`, `MonsterCharacter`, `InteractiveCompanion`, `LottiePlayer`, `ChildSwitcherModal`), `Layout`. Mobile: `components/themed-*`, `components/ui/*`, `constants/theme.ts`.
3. A similar screen for spacing, typography and motion style.
4. The design from the developer, if any.

## Workflow

1. **Location:** used by one feature → `src/features/<feature>/components/`. Used across features → `src/components/`.
2. **Props:** a typed `<Name>Props` interface, minimal, with `onX` callbacks. No `any`.
3. **Style:** Tailwind theme tokens (`primary`, `surface-container`, `on-surface`, …). No new hex classes. Inline style only for dynamic values. Native: `StyleSheet` + theme constants.
4. **Mobile-first:** 360px, `dvh` patterns, ≥ 44px touch targets, safe areas, no horizontal scroll.
5. **States:** loading, error (friendly + retry), empty (encouraging), data. Pending buttons.
6. **Text:** `t("snake_case_key")` with en/hi/gu entries. Child-friendly wording.
7. **Motion:** framer-motion/Lottie as existing screens do. Short, `prefers-reduced-motion` aware, cleaned up on unmount. 3D/particles only on lazy screens.
8. **Accessibility:** `aria-label`s, real buttons, alt text, right/wrong answers shown with icons and text, not just color.
9. Run lint + build, and list the visual checks (phone, WebView, a non-English language).

## Rules

- No new UI, animation or icon libraries (`lucide-react` for icons).
- Extract repeated UI (headers with back + bell, XP badges, stat cards) instead of copying.

## Output

Components and location, props, reused pieces, translation keys, and the checks requested.
