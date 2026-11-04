# CLAUDE.md — nrscholar-frontend

@AGENTS.md

## Claude Code specifics

- Always-on and path-scoped rules load from `.claude/rules/` (generated from `.agents/rules/`).
  The on-demand rules (`security-and-child-privacy`, `performance`, `testing-and-verification`,
  `git-and-pull-requests`) aren't auto-loaded. Read them from `.agents/rules/` when relevant.
- Skills load from `.claude/skills/` (generated from `.agents/skills/`) and trigger automatically,
  or run them as `/<skill-name>`.
- Never edit `.claude/rules/` or `.claude/skills/` directly. Edit `.agents/` and run `node .agents/sync.mjs`.
