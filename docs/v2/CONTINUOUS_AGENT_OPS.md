# Continuous Agent Ops — Eliminate “Run” Interrupts

**Goal:** Walk away for hours while the agent builds, commits, and pushes to Netlify without clicking **Run**.

## What caused the interrupt

The blue **Run** card (and “An error occurred while classifying this action”) appears when Cursor’s **Smart Mode / Auto-review** blocks a shell command — often `git push` — and waits for a human. Repo hooks alone **cannot** override that allowlist today (`allow` from hooks is ignored unless the command is already allowed in Cursor Settings).

## One-time Cursor setting (you do this once)

In Cursor for this machine:

1. Open **Cursor Settings → Agents** (or **Features → Agent**).
2. Set auto-run / terminal mode to **auto-run** / **run everything** for Agent (not “ask every time”).
3. Add these to the **command allowlist** (wording varies by Cursor version; use Allowlist / Auto-run allow list):

```text
git
npm
npx
node
gh
```

Or allow patterns used in this repo:

```text
git *
npm run *
node scripts/*
node scripts/run-with-h-env.mjs *
```

4. Reload the window.

Until that allowlist includes `git push` / `node`, the UI can still demand a human **Run** click no matter what the agent decides.

## What the agent must do (now enforced by rules)

| Rule | Behavior |
|------|----------|
| `.cursor/rules/autonomous-agent-authority.mdc` | Standing push/commit/branch authority — do not wait for clicks |
| `.cursor/rules/netlify-deploy-closeout.mdc` | Every product change ends in push |
| **Never** `request_smart_mode_approval: true` on first try | That flag *creates* the approval card |

Preferred single closeout command:

```powershell
npm run closeout:push
```

which runs `scripts/closeout-push.mjs` (stamp `productionCommit` + push).

## Hooks

`.cursor/hooks.json` + `allow-ship-commands.mjs` auto-signal allow for ship commands. Useful when hooks are honored; not a substitute for the Cursor allowlist (see above).

## Storage

All of this lives on `H:\Block-Street`. Does not change Regnat Populus H-drive rules.
