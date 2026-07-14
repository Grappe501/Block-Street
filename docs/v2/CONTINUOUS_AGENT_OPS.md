# Continuous Agent Ops — Zero Human “Run” Interrupts

**Goal:** Walk away for hours. Agent builds, commits, and pushes to Netlify with **no** Skip/Run clicks.

## What those Pending approval cards actually are

| Card says | Cause | Fix |
|-----------|-------|-----|
| **Edit … `.cursor/hooks.json`** (or any file under `.cursor/`) | **Dotfile / `.cursor` Directory Protection** | Turn that protection **OFF** (or never have the agent edit `.cursor/` — skip the card; hooks are already correct) |
| Shell / `git push` / `closeout:push` | **Auto-review (Smart Mode)** classifier | Set Run Mode to **Run Everything** |
| Edit files outside the workspace | **External-File Protection** | Turn **OFF** for long unattended builds |

Repo hooks **cannot** override Cursor Approvals. They only help when Cursor already honors hook `allow`.

## Steve — do this once (mandatory for walk-away builds)

1. Open **Cursor Settings → Agents → Approvals & Execution**  
   (older UI: **Settings → Agents → Auto-Run**)
2. Set Run Mode to **Run Everything**  
   (not Auto-review, not Allowlist)
3. Under **Other protections**, turn **OFF**:
   - Dotfile Protection / `.cursor` directory protection ← **this is why hooks.json asks for Run**
   - File-Deletion Protection
   - External-File Protection
   - Browser Protection (optional for this repo)
4. In the Agents panel, confirm the Auto-Run / execution dropdown also says **Run Everything** (session can disagree with Settings).
5. **Reload Window** (Command Palette → Developer: Reload Window).

Risk note: Run Everything means no per-command approvals. This machine is trusted for ASYON continuous build. Do not use this mode on untrusted repos.

## Right now — the card on screen

**Click Skip** on “Edit `.cursor/hooks.json`”.  
That file is already correct (`allow-ship-commands.mjs` wired). Editing it again only recreates this interrupt.

## Agent rules (standing)

| Rule | Behavior |
|------|----------|
| `.cursor/rules/autonomous-agent-authority.mdc` | Standing commit/push — do not wait for humans |
| `.cursor/rules/netlify-deploy-closeout.mdc` | Product changes end in push |
| **Never** edit `.cursor/hooks.json` / `.cursor/hooks/*` mid-build unless Steve asked | Dotfile protection forces a Run card |
| **Never** `request_smart_mode_approval: true` on first Shell try | That flag *creates* the blue Run card |
| Prefer `npm run closeout:push` | One ship action |

## permissions.json (backup when not on Run Everything)

Written to:

- `C:\Users\User\.cursor\permissions.json` (user)
- `H:\Block-Street\.cursor\permissions.json` (project)

Under **Run Everything** these are largely unused. If you later switch back to Auto-review, they steer allowlists / classifier.

## Storage

Project truth stays on `H:\Block-Street`. Cursor user permissions live under `%USERPROFILE%\.cursor\` by product design.
