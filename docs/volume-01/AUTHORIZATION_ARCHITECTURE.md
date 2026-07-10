# Build Volume 1.6 — Authentication & Authorization Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.6 · **ENG-006**  
**Artifact:** `AUTHORIZATION_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Permission Resolution Engine](PERMISSION_RESOLUTION_ENGINE.md) [PRE-001]  
**Builds on:** [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [Digital Constitution Layer](DIGITAL_CONSTITUTION_LAYER.md) [DCL-001]  
**Phase alignment:** [Trust, Privacy & Digital Safety](../phase-03/TRUST_PRIVACY_DIGITAL_SAFETY.md) [TPS-001] · [Participant Identity](../phase-03/PARTICIPANT_IDENTITY_DOCTRINE.md) [PEP-001]  
**Live spec:** `data/registry/authorization-architecture.json`

---

## ENG-AU01 — Purpose

**[ENG-AU01]** The Authentication & Authorization Architecture defines how people **securely access** the Community Operating System and how the platform determines **what each person is allowed to see and do**.

**[ENG-AU01a]** Authentication answers:

> **Who are you?**

**[ENG-AU01b]** Authorization answers:

> **What are you allowed to do?**

**[ENG-AU01c]** These responsibilities must **always remain separate** — never conflate identity proof with permission grants.

---

## ENG-AU02 — Guiding Principle

**[ENG-AU02]**

> **Every participant should have access to everything they need—and nothing they should not.**

**[ENG-AU02a]** Security should **protect communities** without making participation difficult [TPS-M02 · CP-007].

---

## ENG-AU03 — Philosophy

**[ENG-AU03]**

| Concept | Behavior |
|---------|----------|
| **Identity** | Permanent — one canonical participant |
| **Permissions** | Contextual — vary by community and role |
| **Roles** | May change over time |
| **Communities** | Membership evolves |
| **Leadership** | Assignments transition |

**[ENG-AU03a]** The participant's **identity remains consistent** while their **responsibilities evolve** [PEP-M01 · PHQ-001].

---

## ENG-AU04 — Architectural Model

**[ENG-AU04]** The authorization model is composed of **six layers**:

```text
Identity
      ↓
Authentication
      ↓
Authorization
      ↓
Community Scope
      ↓
Feature Permissions
      ↓
Data Visibility
```

**[ENG-AU04a]** Each layer builds upon the previous one. Lower layers never depend on higher layers.

**[ENG-AU04b]** All access decisions flow through the [Permission Resolution Engine](PERMISSION_RESOLUTION_ENGINE.md) [PRE-001] — not scattered checks.

---

## ENG-AU05 — Identity Layer

**[ENG-AU05]** Every participant has **one canonical identity** in `identity` schema [ENG-DB06].

**Includes:**

- Participant ID · account ID · profile
- Authentication providers (Supabase Auth link)
- Privacy preferences · communication preferences · security settings

**[ENG-AU05a]** Identity exists **independently of community membership** — membership is a relationship, not identity [PEP-001].

**Kernel path:** `src/lib/kernel/identity/`

---

## ENG-AU06 — Authentication Layer

**[ENG-AU06]** Supported authentication methods are **modular** and **replaceable** without changing application logic.

| Method | V1 | Future |
|--------|-----|--------|
| Email/password | ✅ | — |
| Google OAuth | ✅ | — |
| Microsoft OAuth | Planned | — |
| Apple Sign-In | Planned | — |
| Institution SSO | — | ✅ |
| Passwordless / magic link | — | ✅ |

**[ENG-AU06a]** Provider adapters live in `src/lib/kernel/auth/providers/` — domain services never import provider SDKs directly.

**[ENG-AU06b]** Supabase Auth is the **V1 authentication provider**; the abstraction layer preserves swap-ability [ENG-SA08 Platform Kernel].

---

## ENG-AU07 — Session Management

**[ENG-AU07]** Sessions include:

- Secure tokens (JWT / session cookie via Supabase)
- Expiration · refresh mechanism
- Device awareness · session history
- Optional trusted-device recognition

**[ENG-AU07a]** Participants may **view and revoke** active sessions from Personal Headquarters [PHQ-001 · TPS-M06].

**Storage:** `identity.sessions` · `identity.session_devices`

---

## ENG-AU08 — Authorization Layer

**[ENG-AU08]** Authorization determines what a participant **may do**. It must be:

| Property | Requirement |
|----------|-------------|
| **Role-based** | Roles from DCL configuration [DCL-001] |
| **Permission-based** | Granular action × resource |
| **Context-aware** | Current community · initiative · resource |
| **Community-aware** | Scoped grants, not global defaults |
| **Explainable** | PRE returns reason codes [PRE-001] |
| **Auditable** | Every grant/revoke logged [ENG-AU22] |

**[ENG-AU08a]** **No permissions exist only in frontend code** — UI reflects backend decisions; it does not enforce them [RCN-001 · ENG-D12].

---

## ENG-AU09 — Community Scope

**[ENG-AU09]** Permissions are evaluated **within context**.

**Examples:**

- Volunteer in Community A · mentor in Community B · committee chair in Community C · statewide coordinator for Initiative X

**[ENG-AU09a]** Permissions should be **scoped rather than global** whenever practical [ENG-DB28 Multi-Tenancy].

**Scope dimensions:**

```text
community_id     — primary tenant boundary
initiative_id    — optional campaign scope
committee_id     — working group scope
resource_id      — object-level override
```

**RLS:** Postgres policies enforce `community_id` on all community-scoped tables [ENG-004 · ENG-AU08].

---

## ENG-AU10 — Role Philosophy

**[ENG-AU10]** Roles represent **responsibility—not status**.

**Platform roles (configurable via DCL):**

| Role | Scope |
|------|-------|
| Participant | Default — any authenticated member |
| Volunteer | Community · opportunity participation |
| Mentor | Community · mentorship relationships |
| Organizer | Community · mission and event leadership |
| Community Administrator | Single community governance |
| Regional Coordinator | Multi-community region |
| System Administrator | Platform operations (elevated, audited) |

**[ENG-AU10a]** Roles may be **extended through configuration** — not hard-coded enums [DCL-M02 · ENG-AU08].

---

## ENG-AU11 — Permission Model

**[ENG-AU11]** Permissions are **granular** and **reusable across domains**.

**Examples:**

```text
community.view          community.edit
mission.create          mission.approve
story.publish           event.manage
participant.invite      mentor.assign
report.view             data.export
```

**[ENG-AU11a]** Permission keys follow `{domain}.{action}` convention — stored in `constitution.permissions` [DCL-001].

**[ENG-AU11b]** Role ↔ permission mapping in `constitution.role_permissions` — editable without deploy for supported changes.

---

## ENG-AU12 — Permission Groups

**[ENG-AU12]** Bundle permissions into **configurable groups** for administration:

| Group | Typical permissions |
|-------|---------------------|
| Community Organizer | community.edit · mission.create · participant.invite |
| Volunteer Coordinator | opportunity.manage · mentor.assign |
| Event Manager | event.manage · event.checkin |
| Knowledge Curator | story.publish · lesson.capture |
| Story Editor | story.edit · story.publish |
| Mentorship Coordinator | mentor.assign · mentor.view_private |

**[ENG-AU12a]** Groups simplify assignment — a participant receives a group within a community scope rather than individual permission rows.

---

## ENG-AU13 — Resource Ownership

**[ENG-AU13]** Every major resource has an **owner** (`owner_id` · `owner_type`):

Mission · event · story · community · committee · knowledge article

**[ENG-AU13a]** Ownership determines **default administrative authority** while respecting broader governance rules and community charters [CCN-001].

**[ENG-AU13b]** Owners may delegate sub-actions without transferring ownership [ENG-AU18].

---

## ENG-AU14 — Visibility Levels

**[ENG-AU14]** Every object defines **visibility** — evaluated **independently** from editing permissions [TPS-M07].

| Level | Meaning |
|-------|---------|
| **Private** | Owner and explicit grants only |
| **Team** | Assigned team members |
| **Committee** | Committee membership |
| **Community** | All community members |
| **Regional** | Communities in region |
| **Statewide** | All authenticated participants (Arkansas network) |
| **Public** | Unauthenticated read where policy allows |

**[ENG-AU14a]** Visibility gates **read** access; permissions gate **write/action** access — both evaluated by PRE [PRE-001].

---

## ENG-AU15 — Privacy Controls

**[ENG-AU15]** Participants control [TPS-M06]:

- Public profile visibility · contact information
- Community directory visibility · mentorship availability
- Opportunity availability · communication preferences

**[ENG-AU15a]** Privacy defaults to **protective settings** while remaining easy to understand [TPS-M04 · DG-004].

**Storage:** `identity.privacy_settings` · enforced in PRE visibility pass.

---

## ENG-AU16 — Delegation

**[ENG-AU16]** Leadership may **temporarily delegate** responsibilities:

Event management · community moderation · volunteer coordination · committee administration

**Required fields:**

```text
delegator_id · delegate_id · scope · permissions[]
start_date · end_date · reason (optional)
```

**[ENG-AU16a]** Active delegations merge into PRE evaluation · full **audit history** preserved [ENG-AU22].

**Storage:** `identity.delegations`

---

## ENG-AU17 — Administrative Authority

**[ENG-AU17]** Administrative authority is **always limited by scope**:

- Community administrators **cannot** automatically administer other communities
- Regional coordinators **cannot** access private participant information outside their responsibilities
- System administrators use elevated privileges **sparingly** with mandatory auditing [DG-012]

**[ENG-AU17a]** **Separation of duties** — no single role holds all permissions by default [ENG-AU23].

---

## ENG-AU18 — Approval Workflows

**[ENG-AU18]** Certain actions require **approval** before execution:

Launch new community · publish public announcements · create statewide initiatives · assign elevated permissions

**[ENG-AU18a]** Workflows are **configurable** in DCL (`constitution.approval_workflows`) — PRE returns `pending_approval` when required [PRE-001].

**Phase refs:** CEF-001 · CCN-001 · WBS-001.

---

## ENG-AU19 — Audit Trail

**[ENG-AU19]** Authorization changes record:

| Field | Purpose |
|-------|---------|
| `granted_by` | Who granted access |
| `granted_to` | Who received access |
| `changed_at` | When |
| `previous_permissions` | Before state |
| `new_permissions` | After state |
| `reason` | Optional justification |

**[ENG-AU19a]** Security decisions are **always traceable** — `platform.audit_log` + `identity.authorization_history` [ENG-DB22].

---

## ENG-AU20 — Security Principles

**[ENG-AU20]** The platform follows:

- **Least privilege** — minimum permissions for the task
- **Explicit permission grants** — no implicit elevation
- **Secure defaults** — deny unless granted
- **Defense in depth** — PRE + RLS + service checks
- **Separation of duties** — sensitive actions require multiple roles
- **Comprehensive auditing** — privileged operations logged

**Phase alignment:** TPS-001 · DG-004 · CP-007.

---

## ENG-AU21 — Future Identity Features

**[ENG-AU21]** Future enhancements **extend** — never replace — this architecture:

Institutional identity verification · volunteer certification · MFA · hardware security keys · federated identity · temporary guest access · service accounts for automation

**[ENG-AU21a]** Feature flags gate rollout; PRE and identity schema accommodate new auth factors without redesign.

---

## ENG-AU22 — Future AI Assistance

**[ENG-AU22]** AI may assist by:

- Explaining why access is denied [PRE explanation payload]
- Suggesting appropriate permission changes (human approval required)
- Identifying unusual permission patterns
- Recommending periodic permission reviews

**[ENG-AU22a]** AI **must never grant or revoke permissions independently** [AIB-001 · TPS-M15 · DG-003].

---

## ENG-AU23 — Permission Resolution Engine

**[ENG-AU23]** Rather than scattering authorization checks, every access decision flows through the centralized **[Permission Resolution Engine](PERMISSION_RESOLUTION_ENGINE.md) [PRE-001]**.

**Evaluates:**

1. Who is requesting access?
2. What resource is being accessed?
3. What action is requested?
4. What community or initiative is the current context?
5. What roles and delegated permissions apply?
6. What visibility level does the resource have?
7. Are there additional policy or approval requirements?

**[ENG-AU23a]** Returns **decision + explanation** — logged or shown to participant when appropriate.

**Kernel path:** `src/lib/kernel/permissions/`

---

## ENG-AU24 — Burt Implementation Guidance

**[ENG-AU24]** Implementation should:

- **Separate** authentication from authorization — distinct modules, distinct tests
- Keep permission evaluation in **backend/domain services** — never UI-only
- Make roles and permissions **configuration-driven** [DCL-001]
- **Scope** permissions to communities and initiatives
- **Audit** every privileged operation
- **Avoid hard-coded role checks** — use PRE with permission keys
- Apply **RLS** on all community-scoped tables before production data
- Wire API layer [ENG-005] to PRE middleware when built

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) | identity schema · RLS · audit |
| [DCL-001](DIGITAL_CONSTITUTION_LAYER.md) | roles · permissions · workflows |
| [1.7 Domain Services](DOMAIN_SERVICE_ARCHITECTURE.md) | service-level authorization hooks |
| [TPS-001](../phase-03/TRUST_PRIVACY_DIGITAL_SAFETY.md) | privacy · trust · youth safety |
| [1.5 API Architecture](API_ARCHITECTURE.md) | auth middleware · token validation [pending] |

---

## AC-089 — Acceptance Criteria

Volume 1.6 is complete when:

- [x] **[AC-089a]** Identity and authentication architecture documented. `[ENG-AU05, ENG-AU06, ENG-AU07]`
- [x] **[AC-089b]** Authorization and permission models defined. `[ENG-AU08, ENG-AU11, ENG-AU12]`
- [x] **[AC-089c]** Community-scoped access established. `[ENG-AU09, ENG-AU17]`
- [x] **[AC-089d]** Privacy, delegation, approval, and auditing incorporated. `[ENG-AU15–ENG-AU19]`
- [x] **[AC-089e]** Permission Resolution Engine specified. `[ENG-AU23, PRE-001]`
- [x] **[AC-089f]** Burt has blueprint for secure, scalable access control. `[authorization-architecture.json]`

---

**Note:** Step **1.5 API Architecture** [ENG-005] remains pending — build when ready; auth integrates at API middleware layer.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.7 — Domain Service Architecture](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-007]

**End of Volume 1.6 — Authentication & Authorization Architecture.**
