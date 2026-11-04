---
trigger: model_decision
description: Apply when creating branches, writing commit messages, preparing or describing pull requests for nrscholar-frontend
---

# Git and pull requests — nrscholar-frontend

## Branches

- `main`: production (the default branch).
- `develop`: integration. Work PRs target `develop`. `develop` → `main` for releases.
- Work branches: `<type>/<kebab-description>` from up-to-date `develop`. Types: `feat/`, `fix/`, `refactor/`, `perf/`, `chore/`, `docs/`, `test/`, `hotfix/` (from `main`, merged back to `develop`).
  - ✅ `feat/weekly-test-timer`, `fix/boss-battle-hp-reset`
- `*-backup-*` branches are maintainer snapshots. Never commit to them.

## Commits: Conventional Commits

`type(scope): imperative summary`, lower case, no period, ≤ 72 characters. The scope is the feature or app part (`missions`, `parent-report`, `mobile`, `webview`, `i18n`).

- ✅ `fix(mission-play): keep progress when the app resumes`
- ❌ `fix:major bug fixes`, `fix: bugs found during meeting`, `Fixed`, `fix:Student mission screen` (no space, vague)
- Say *what* changed. "Bug fixes" isn't a summary.
- Breaking: `!` + a `BREAKING CHANGE:` footer (for example a changed web route the mobile shell opens).
- One logical change per commit. Web and mobile changes for one feature may share a PR, but use separate commits.

## Pull requests

- Title = a Conventional Commit line. Fill in `.github/pull_request_template.md`.
- Screenshots/video at phone width, from the WebView if the screen opens inside the app.
- ≤ ~400 changed lines excluding lockfiles, assets and translations. One concern per PR.
- Link the backend PR when the API changes.
- **Squash merge** into `develop`. **Merge commit** from `develop` into `main`.

## AI assistants

Don't commit, push, open or merge PRs unless asked in the session. Never `--no-verify`. Never rewrite published history.
