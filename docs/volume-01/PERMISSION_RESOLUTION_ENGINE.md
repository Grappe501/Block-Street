# Permission Resolution Engine

**Document ID:** PRE-001  
**Artifact:** `PERMISSION_RESOLUTION_ENGINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Authorization Architecture](AUTHORIZATION_ARCHITECTURE.md) [ENG-006 · ENG-AU23]

**Live spec:** `data/registry/permission-resolution-engine.json`

> Every access decision flows through one engine — consistent enforcement, explainable outcomes, testable behavior.

---

## PRE-M01 — Purpose

**[PRE-M01]** The **Permission Resolution Engine (PRE)** is the centralized authorization decision point for the Community Operating System.

**[PRE-M01a]** Instead of scattering `if (role === 'admin')` checks across services and UI, **every access decision** invokes PRE.

**[PRE-M01b]** PRE returns both the **decision** (`allow` · `deny` · `pending_approval`) and an **explanation** suitable for logs, APIs, and participant-facing messages.

---

## PRE-M02 — Evaluation Pipeline

**[PRE-M02]** PRE evaluates requests in order — short-circuit on deny:

```text
1. Authenticate request        → participant_id (or anonymous)
2. Resolve resource              → type, id, owner, visibility
3. Resolve context               → community_id, initiative_id, committee_id
4. Check visibility (read)       → ENG-AU14 levels
5. Check permissions (action)    → role + group + delegation grants
6. Check ownership override      → owner default admin rights
7. Check approval requirements   → ENG-AU18 workflows
8. Apply policy constraints      → TPS youth safety, DG guardrails
9. Emit decision + explanation
```

---

## PRE-M03 — Request Contract

**[PRE-M03a]** Input:

```typescript
interface PermissionRequest {
  actorId: string | null;           // null = anonymous
  action: string;                   // e.g. "mission.create"
  resourceType: string;           // e.g. "mission"
  resourceId?: string;
  context: {
    communityId?: string;
    initiativeId?: string;
    committeeId?: string;
  };
  metadata?: Record<string, unknown>;
}
```

**[PRE-M03b]** Output:

```typescript
interface PermissionDecision {
  decision: "allow" | "deny" | "pending_approval";
  explanation: {
    code: string;                   // e.g. "INSUFFICIENT_ROLE"
    message: string;                // human-readable
    factors: string[];              // audit trail hints
  };
  effectivePermissions?: string[];  // when allow
  approvalWorkflowId?: string;      // when pending_approval
}
```

---

## PRE-M04 — Decision Factors

**[PRE-M04]** PRE answers seven questions [ENG-AU23]:

| # | Question | Source |
|---|----------|--------|
| 1 | Who is requesting? | Identity layer · session |
| 2 | What resource? | Domain repository |
| 3 | What action? | Permission key |
| 4 | What context? | Request scope · UI context |
| 5 | What roles/delegations apply? | `identity.memberships` · `identity.delegations` · DCL roles |
| 6 | What visibility? | Resource `visibility` field |
| 7 | Approval/policy required? | DCL workflows · TPS policies |

---

## PRE-M05 — Explanation Codes

**[PRE-M05]** Standard denial codes (extensible via DCL):

| Code | Meaning |
|------|---------|
| `UNAUTHENTICATED` | Action requires login |
| `INSUFFICIENT_ROLE` | Role lacks permission |
| `OUT_OF_SCOPE` | Wrong community/initiative context |
| `VISIBILITY_DENIED` | Read level too restricted |
| `DELEGATION_EXPIRED` | Temporary grant ended |
| `APPROVAL_REQUIRED` | Action queued for approval |
| `POLICY_BLOCKED` | Trust/safety/youth policy |
| `OWNER_ONLY` | Reserved to resource owner |

**[PRE-M05a]** AI may **explain** these codes to participants — never override them [ENG-AU22].

---

## PRE-M06 — Integration Points

**[PRE-M06a]** **API middleware** [ENG-005] — validate token, call PRE before route handler.

**[PRE-M06b]** **Domain services** — call PRE at service entry for mutating operations.

**[PRE-M06c]** **Postgres RLS** — policies mirror PRE rules as defense-in-depth; PRE is authoritative for application logic.

**[PRE-M06d]** **UI** — fetch effective permissions for UI hints; never rely on UI-only hiding.

**Kernel path:** `src/lib/kernel/permissions/resolver.ts`

---

## PRE-M07 — Caching & Performance

**[PRE-M07a]** Cache effective permissions per `(participant_id, community_id)` with short TTL (60s default).

**[PRE-M07b]** Invalidate cache on: role change · delegation grant/revoke · membership change · DCL definition update.

**[PRE-M07c]** Never cache **deny** decisions longer than allow — security-sensitive paths re-evaluate.

---

## PRE-M08 — Testing

**[PRE-M08]** PRE must have **contract tests** for every permission key × role × scope combination documented in DCL.

**Test matrix:** `tests/kernel/permissions/` — table-driven scenarios from `data/registry/permission-resolution-engine.json`.

---

## PRE-M09 — V1 Scope

**[PRE-M09a]** V1 implements: participant · volunteer · organizer · community_admin roles; community scope; core permission keys for community, mission, event, story.

**[PRE-M09b]** Delegation, approval workflows, and regional scope — schema ready · full UI in v1.1+.

---

## AC-090 — Acceptance Criteria

- [x] **[AC-090a]** PRE purpose and pipeline documented. `[PRE-M01, M02]`
- [x] **[AC-090b]** Request/response contract specified. `[PRE-M03]`
- [x] **[AC-090c]** Integration points and testing strategy defined. `[PRE-M06, M08]`

---

**End of Permission Resolution Engine.**
