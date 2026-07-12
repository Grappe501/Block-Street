# Initiative Constitution

**Build:** 11.1 · **Wave:** W1 · **System ID:** INI-001  
**Wave ID:** CAE-11.1-W1  
**Status:** Canonical documentation (technical enforcement planned W2–W8)

> **Every organized body of work must have a clear purpose, an accountable Human, an authorized institution, a defined scope, and a measurable reason for existing.**

**Live contracts:** `data/phase-11/initiative_vocabulary.json` · `data/phase-11/initiative_types.json` · `src/lib/civic-action/builds/11.1/constitution.ts`

**Specialized documents** in this folder extend but do not contradict this constitution.

---

## Constitutional Formula

```text
Identified Need + Institutional Authority + Clear Purpose + Accountable Human Ownership + Defined Scope + Expected Outcome = Governed Initiative
```

An initiative is not valid merely because someone created a page, named a project, or entered a task.

---

## Definition

An **Initiative** is the canonical platform container for a coordinated, time-bounded or continuously governed body of work undertaken by one or more institutions to produce a defined result.

An initiative organizes: strategic purpose, objectives, workstreams, missions, teams, responsibilities, calendar, resources, communications, decisions, risks, evidence, outcomes, learning, and closeout.

---

## Execution Hierarchy

```text
Institutional Mission → Strategic Priority → Initiative → Objective → Workstream → Mission → Task → Evidence → Outcome → Learning
```

The initiative is where institutional strategy becomes governed execution.

---

## Ten Constitutional Commitments

1. **Institution** — Every initiative belongs to one governing institution.
2. **Human accountability** — Every active initiative has executive, operational, and recommended backup owners; service identities prohibited.
3. **Purpose** — Active initiatives require need, intended change, beneficiaries, alignment, and consequence of inaction.
4. **Scope** — Institutional, Human, geographic, time, functional, data, resource, and public boundaries are explicit.
5. **Lifecycle** — Governed states from concept through archive; no indefinite active status without review.
6. **Closeout basis** — Every initiative defines how and why it may end.
7. **Bounded authority** — Initiative ownership does not grant institution admin, identity, financial, or coalition authority.
8. **Strategic connection** — Active initiatives link to mission, priority, mandate, emergency authorization, or compliance obligation.
9. **History** — Major changes are versioned and auditable, not silently overwritten.
10. **AI boundaries** — AI may assist; AI may not own, approve, activate, expand scope, cancel, or complete initiatives.

---

## Initiative Types (Primary)

| Type | Summary |
|------|---------|
| Program | Recurring ongoing value |
| Campaign | Time-bounded measurable target |
| Project | Bounded deliverable |
| Operation | Coordinated time-sensitive execution |
| Pilot | Limited test with evaluation |
| Community Response | Immediate community need |
| Educational Initiative | Learning or certification |
| Research Initiative | Evidence and findings |
| Coalition Initiative | Multi-institution (COL-001) |
| Institutional Change | Internal transformation |
| Emergency Initiative | Expedited, time-limited authority |
| Continuous Operating Function | Enduring institutional responsibility |

One primary type per initiative. Secondary characteristics allowed (e.g., Educational + Pilot).

See [INITIATIVE_TAXONOMY.md](INITIATIVE_TAXONOMY.md).

---

## Ownership Model

| Role | Accountability |
|------|----------------|
| Executive Owner | Institutional legitimacy, strategic outcome, major escalation, closeout acceptance |
| Operational Owner | Charter, workstreams, progress, blockers, reporting, closeout initiation |
| Backup Owner | Succession when operational owner unavailable (required for high-risk types) |
| Creator | Begins draft; does not automatically hold authority |
| Approver | Authorized to move initiative into approved state |

**Prohibited owners:** anonymous account, service identity, shared login, AI, deleted/inactive Human, unapproved external partner.

**Ownerless rule:** Active initiatives without eligible operational owner enter `owner_required`; high-risk execution pauses.

See [INITIATIVE_AUTHORITY_MODEL.md](INITIATIVE_AUTHORITY_MODEL.md).

---

## Scope and Charter

Every approved initiative requires explicit in-scope and out-of-scope statements across institutional, Human, geographic, time, functional, data, resource, and public dimensions.

Material scope expansion requires governed review, charter version, and approval.

Required charter sections are defined in [INITIATIVE_CHARTER_STANDARD.md](INITIATIVE_CHARTER_STANDARD.md).

---

## Lifecycle (Constitutional Meaning)

| State | Meaning |
|-------|---------|
| concept | Idea not yet validated |
| discovery | Need, stakeholders, feasibility investigated |
| design | Structure, charter, owners, timeline developed |
| approval | Authorized decision to proceed |
| preparation | Approved but not yet fully active |
| active | Authorized execution underway |
| paused | Temporarily stopped; records retained |
| at_risk | Continues with substantial concerns documented |
| closing | Closeout underway |
| completed | Met approved closeout basis |
| cancelled | Ended before planned completion with recorded reason |
| archived | Non-operational; retained per policy |

Detailed state machine: **11.1-W2**. See [INITIATIVE_LIFECYCLE_CONSTITUTION.md](INITIATIVE_LIFECYCLE_CONSTITUTION.md).

---

## Visibility vs Authority

Visibility states: private, institution internal, participating institutions, member public, public.

Visibility does not grant edit, assignment, private data, budget, communications, or closeout authority.

---

## Prohibited Patterns

Ownerless active initiative · zombie initiative · shell initiative · authority laundering · scope creep without review · duplicate shadow initiative · AI-owned initiative · service-account ownership · hidden initiative · permanent emergency · vanity initiative · retroactive initiative without honest labeling.

---

## Cross-Phase Relationships

| System | Relationship |
|--------|--------------|
| Identity Trust Layer | Global Human ID, institution context, permissions on every action |
| Phase 5 IOS / ACN | Historical coordination model; INI-001 is constitutional root for Phase 11 |
| 11.2 Objectives | Objectives live inside initiatives |
| 11.3 Missions | Workstreams and missions execute inside initiatives |
| 11.9 Coalition | Coalition mechanics; host does not own participant institutions |
| 11.10 Decisions | Approvals and escalations |
| 11.13 Evidence | Completion proof and attribution |
| 11.14 Playbooks | Templates from completed initiatives |
| 11.15 Safety | Gates for sensitive populations and high-risk activity |

---

## Requirement Index

44 Wave 1 requirements: `CAE-11.1-W1-CON-001` through `CON-020`, `POL-001` through `POL-008`, `SEC-001` through `SEC-006`, `PRV-001` through `PRV-005`, `ACC-001` through `ACC-005`.

Registry: `data/civic-action/requirements_registry.json` · [PHASE_11_REQUIREMENTS_REGISTRY.md](../PHASE_11_REQUIREMENTS_REGISTRY.md)

**Status:** All documented. Technical enforcement planned for 11.1-W2 through W8.

---

## Acceptance Scenarios

Eight scenarios defined in wave package: valid internal program, ownerless initiative, AI ownership attempt, cross-institution initiative, scope creep, emergency initiative, cancellation, draft without authority.

Tests are specification-level in W1; automated enforcement in later waves.

---

## Terminology Alignment Notes

| Existing | Phase 11 INI-001 |
|----------|------------------|
| Phase 5 IOS initiative (multi-community coordination) | Extended with institutional governance; not replaced |
| Phase 5 ACN action hierarchy | Aligned under Phase 11 execution hierarchy |
| `privacy_level` in civic-action MVP (`public`/`internal`/`restricted`) | Maps to visibility model in W2 |
| `emergency_operation` code type | Alias of `emergency_initiative` in type registry |
| `leadership_initiative` code type | Secondary characteristic; primary type often `educational_initiative` or `program` |

No conflicting root object introduced. Initiative remains canonical container.
