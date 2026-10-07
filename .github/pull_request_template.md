<!-- Title must be a Conventional Commit line: type(scope): imperative summary
     e.g. fix(mission-play): keep progress when the app resumes -->

## Summary

<!-- What changed, in 1–3 sentences. Be specific, not "bug fixes". Link the ticket. -->

## Why

## Type of change

- [ ] `feat`
- [ ] `fix`
- [ ] `refactor` (no behavior change)
- [ ] `perf`
- [ ] `chore` / `docs` / `test`

## Part of the app

- [ ] Web (`src/`)
- [ ] Mobile (`mobile/`)
- [ ] Both / WebView bridge

## Screenshots / video

<!-- Phone width; from inside the app WebView if the screen opens there. -->

## Contracts

- Backend PR (deploy first?):
- Web routes opened by the mobile app changed?
- Token / storage keys changed?

## How it was tested

- [ ] `npm run lint` + `npm run build`
- [ ] `yarn lint` in `mobile/` (if touched)
- [ ] Child role and parent role (parental gate enforced)
- [ ] Phone width + mobile WebView
- [ ] English + Hindi/Gujarati
- [ ] Loading / offline / empty states

## Child safety & privacy

- [ ] No new personal data collected or shared, no new third-party SDKs
- [ ] Parental gate / screen-time behavior unchanged (or explained above)

## Checklist

- [ ] Follows `.agents/rules/` (apiFetch via feature api/hooks, theme tokens, `t()` keys in en/hi/gu)
- [ ] No new `any`, hex color classes or hardcoded text
- [ ] No unrelated changes, no secrets, no `mobile/.expo/` cache files
