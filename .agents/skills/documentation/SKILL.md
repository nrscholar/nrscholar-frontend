---
name: documentation
description: Use when writing or updating documentation in nrscholar-frontend — README (currently the Vite template), setup for web and mobile, environment notes, component docs, or the AI rules and skills in .agents/.
---

# Documentation — nrscholar-frontend

## What lives where

| Doc | Location | Update when |
| --- | --- | --- |
| Project setup (web + mobile), scripts, env, deploy | `README.md` | Setup changes. It's still the default Vite template, so replacing it is welcome |
| Mobile specifics (Expo, EAS, WebView) | `README.md` section or `mobile/README.md` | Build/run steps change |
| AI rules & skills | `.agents/rules/*.md`, `.agents/skills/*/SKILL.md` | Conventions or workflows change. Then run `node .agents/sync.mjs` |
| Component contracts | JSDoc on shared components | Props/behavior aren't obvious |

## Workflow

1. Read the code you're documenting. Verify every command, path, URL and env var on the current branch.
2. Write for the developer who must act: what, when, example, pitfalls.
3. One canonical place per topic. Link instead of copying.
4. AI rules/skills: edit only `.agents/`, keep frontmatter valid, run `node .agents/sync.mjs`, and commit the generated copies.

## Rules

No invented commands or endpoints. No secrets or real tokens in docs. Examples follow repo style (double quotes, semicolons).
