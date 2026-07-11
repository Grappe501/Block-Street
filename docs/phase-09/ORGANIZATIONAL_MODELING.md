# Organizational Modeling — Build 9.2

**System ID:** ORG-001 · **AC-187** · Phase 9 Step 9.2

---

## Purpose

Convert the provisioned institutional shell into a living organizational map — hierarchy, leadership, roles, workspaces, geography, approvals, and versioned configuration.

> The platform should adapt to the institution's structure without allowing the institution to become structurally invisible, ownerless, or ungovernable.

---

## APIs

- `GET/POST /api/v1/institutions/{id}/units` · `GET/PATCH /api/v1/organizational-units/{id}`
- `GET /api/v1/institutions/{id}/structure` · `POST .../units/{id}/move`
- `GET/POST .../units/{id}/owners` · `leadership` · `members` · `roles`
- `GET/POST /api/v1/institutions/{id}/configuration` · `validate` · `approve` · `activate`
- `POST /api/v1/institutions/{id}/reorganizations` · `preview` · `execute`
- `GET /api/admin/organization/overview`

---

## Engine & Data

- `src/lib/organization/`
- `data/organization/`

**Platform docs:** `docs/platform/organization/*`

---

## Acceptance Criteria (AC-187)

- Canonical typed organizational hierarchy
- Campus, county, region, chapter, department, program, team, committee support
- Ownership, leadership, membership, explicit role inheritance
- Workspace mapping with cross-institution denial
- Configuration templates with draft → validate → approve → activate
- Reorganization with historical version preservation
- Organization chart and health dashboard
