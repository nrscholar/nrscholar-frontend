---
name: translations
description: Use when adding, changing or fixing user-visible text in nrscholar-frontend — new i18n keys, missing Hindi/Gujarati translations, moving hardcoded English into t(), child-friendly copy.
---

# Translations — nrscholar-frontend

Rules: the `i18n` rule. Files: `src/locales/{en,hi,gu}.json` (`"translation"` namespace).

## Workflow

1. **Collect** every visible string in scope: headings, buttons, placeholders, toasts, empty/error states, `aria-label`s.
2. **Reuse** an existing key if the same text exists. Search all three files first.
3. **New keys are `snake_case`** with a feature prefix (`boss_battle_victory`, `parent_report_title`).
4. **Add to all three files**, keeping the existing ordering style. Use natural Hindi (Devanagari) and Gujarati, in a warm, simple, child-appropriate tone for kid screens and clear, respectful language for parent screens. Keep `{{placeholders}}` and `{{brandName}}` exactly.
5. **Replace** the hardcoded strings with `t("key")`. Use interpolation instead of concatenation.
6. Validate the JSON (the build fails on broken JSON). Run `npm run build`.

## Rules

- Never leave a language missing. List uncertain translations for native-speaker review.
- Don't rename or delete existing keys in an unrelated task.
- Learning content (`src/shared/assets/Content/`) isn't moved into locale files.

## Output

Keys added/changed per language, strings needing review, and files touched.
