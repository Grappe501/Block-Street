# Institutional Provisioning — Build 9.1

**System ID:** PRV-001 · **AC-186** · Phase 9 Step 9.1

---

## Purpose

Governed institutional birth: request → risk review → ownership → template → provision → validate → configuration required.

> No institution enters without clear ownership, explicit scope, secure defaults, and a visible launch state.

---

## Canonical APIs (`/api/v1/institutions`)

**Requests:** `POST/GET /requests` · `PATCH /requests/{id}` · `submit` · `approve` · `reject`

**Provisioning:** `POST /provision` · `GET /{id}/provisioning` · `run` · `pause` · `resume` · `validate`

**Templates:** `GET /institution-templates` · `GET /institution-templates/{id}`

**Owners / Modules / Workspaces:** `GET /{id}/owners` · `modules` · `workspaces`

**Health:** `GET /institutions/health`

---

## Engine & Data

- `src/lib/provisioning/` — requests, risk, provisioning run, validation, audit
- `data/provisioning/` — institution types, templates, security baselines, store

**Platform docs:** `docs/platform/provisioning/*`

---

## Acceptance Criteria (AC-186)

- Governed request workflow with risk classification P1–P4
- Five required owners assigned with audit trail
- Versioned templates create workspaces, modules, security baseline
- Training and pilot workspaces provisioned
- Restricted capabilities remain disabled (mass notifications, AI draft-only, public publishing off)
- Validation engine blocks ownerless workspaces
- Provisioning pause/resume with checkpoint
- Full provisioning audit history
