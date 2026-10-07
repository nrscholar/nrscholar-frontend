---
name: git-pr-preparation
description: Use when preparing nrscholar-frontend work for review — naming the branch, writing specific Conventional Commit messages, writing the PR title and description with phone/WebView screenshots and linked backend PRs.
---

# Git & PR preparation — nrscholar-frontend

Conventions: the `git-and-pull-requests` rule. Only commit, push or open a PR if the developer asked
for that in this session.

## Workflow

1. **Inspect:** `git status`, `git diff --stat develop...HEAD`, `git log --oneline develop..HEAD`. Exclude `.env*`, `mobile/.expo/` cache, build output and unrelated changes.
2. **Branch:** `<type>/<kebab-description>` from `develop` (`hotfix/` from `main`).
3. **Pre-flight:** `npm run lint`, `npm run build`, `yarn lint` in `mobile/` if touched, and `node .agents/sync.mjs --check` if `.agents/` changed. Report failures. Never `--no-verify`.
4. **Commits:** a specific `type(scope): summary` (never "major bug fixes"). Separate web and mobile commits.
5. **PR description:** fill in the template: summary, why, screenshots/video (phone width; WebView if opened from the app), roles tested (child/parent), languages checked, backend PR link, WebView/route contract changes, manual test results.
6. **Size:** over ~400 changed lines (excluding assets, lockfiles, translations)? Propose a split.

## Output

Branch name, commit list, PR title, and the PR body ready to paste (or created with `gh pr create` if asked).
