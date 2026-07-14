# V2-A Run Button Audit

**Date:** 2026-07-14  
**Machine twin:** `data/v2/run-button-audit.json`

## Classification summary

| Surface | Count | Disposition |
|---------|------:|-------------|
| Participant launch / county / college | **0** labeled “Run” | N/A — no product Run dependency for participants |
| Ops identity certification | 2 | Operator tool — keep; audience = Operator |
| Admin Director demos (“Run Acceptance Demo”, wave cert) | Many | Operator / Architect tools — not participant UX |
| Cursor IDE “Pending approval → Run” | External | **Not product** — requires Cursor **Run Everything** + Dotfile Protection off |

## Product findings

1. **No participant-facing generic “Run”** on `/start`, `/network`, `/s/*`, `/county/*`, `/schools/*`.
2. Build execution must not depend on a website user clicking Run. Hosted work uses Netlify / GitHub / functions.
3. Do not fake continuous jobs in the browser.

## Cursor IDE distinction (critical)

The blue **Run** card Steve sees in Agents is **Cursor Approvals**, not ASYON UI.

Repository rules establish standing autonomy but **cannot guarantee** Cursor continues after the app closes or when Dotfile / Auto-review blocks remain on.

Hard boundaries still stop the agent: secrets, destructive irreversibility, cross-repo edits, auth failures, legal safety.

See `docs/v2/CONTINUOUS_AGENT_OPS.md` and `.cursor/rules/autonomous-agent-authority.mdc`.

## Hosted-execution readiness

| Need | Status |
|------|--------|
| Git → Netlify deploy | Live |
| Durable JSON / Blobs | Live (pre-Postgres) |
| Scheduled / background workers for civic jobs | Partial — use Netlify scheduled functions / Actions when a job is mandatory after browser close |
| Frontend-as-worker | Forbidden |

## Dispositions logged

See JSON twin for each known control.
