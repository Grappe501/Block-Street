# Build Step 1.8 — Implementation Doctrine & Engineering Protocol

**Document ID:** PHASE-001.8  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Foundational Constitution (final step)

> **Everything before this explained *what* we're building.**  
> **This document explains *how Burt builds it*.**  
> It is the engineering constitution — Burt's operating manual.

**Builds On:** [ED-001] from PHASE-001.4 · [GM-P2] vertical slices · [BG-001] · [LS-010] · All PHASE-001.1–001.7

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| ED-002 | Purpose |
| ED-003 | Primary engineering principle |
| ED-LC | Development lifecycle (5 phases) |
| ED-GR | Golden rule |
| ED-VS | Vertical slice development |
| ED-SCD | Small, complete deliverables |
| ED-SF | Stable foundations priority |
| ED-DF | Documentation first |
| ED-ME | Modular engineering |
| ED-DB | Database philosophy |
| ED-UX | User experience philosophy |
| ED-MF | Mobile-first engineering |
| ED-SEC | Security philosophy |
| ED-PERF | Performance philosophy |
| ED-VC | Version compatibility |
| ED-QS | Quality standards |
| ED-IQ | Implementation questions |
| ED-BR | Burt's responsibilities |
| ED-SR | Steve's responsibilities |
| ED-FL | Feedback loop |
| ED-CC | Completion criteria |
| ED-FD | Burt's final deliverable |
| AC-008 | Step 1.8 acceptance criteria |

*Standing doctrine [ED-001] remains authoritative. This document expands it into full engineering protocol.*

---

## ED-002 — Purpose

**[ED-002]** This document establishes the implementation philosophy and engineering protocol for building the Arkansas Student & Youth Organizing Network.

**[ED-002a]** It defines how implementation decisions should be made, how work should be organized, how quality should be maintained, and how future versions should evolve.

**[ED-002b]** The implementation team should treat this document as the operational guide for translating approved design into production software.

**[ED-002c]** Burt reads this document — and the full Build Bible — before writing any code.

---

## ED-003 — Primary Engineering Principle

**[ED-003]**

> **Design completely. Build deliberately. Validate thoroughly. Improve continuously.**

**[ED-003a]** The platform is never built from assumptions.

**[ED-003b]** It is built from approved design documents.

*Extends [ED-001]: Design First · Build Second · Validate Third · Iterate Fourth.*

---

## ED-LC — Development Lifecycle

**[ED-LC]** Every capability follows the same lifecycle:

### Phase 1 — Design

- Requirements
- Architecture
- Approval

### Phase 2 — Implementation

- Database
- Backend
- Frontend
- Testing

### Phase 3 — Validation

- Manual review
- Functional testing
- Acceptance testing
- Performance testing

### Phase 4 — Feedback

- Observe
- Collect feedback
- Identify friction
- Prioritize improvements

### Phase 5 — Version Next

- Plan
- Design
- Implement
- Repeat

*Maps to [ED-001] four-step cycle; Phases 4–5 extend into continuous improvement [GM-002].*

---

## ED-GR — Golden Rule

**[ED-GR]** Never begin implementing a capability that has not first been designed and approved.

**[ED-GRa]** If no approved design document exists → **pause implementation** and request design step.

**[ED-GRb]** Aligns with [ED-001a] and [LS-010].

---

## ED-VS — Vertical Slice Development

**[ED-VS]** Every capability should be completed **vertically** before starting the next.

**Example — Institution Directory:**

```
Database
  ↓
API
  ↓
Admin Interface
  ↓
Public Interface
  ↓
Search
  ↓
Mobile
  ↓
Testing
  ↓
Documentation
  ↓
Complete
```

**[ED-VSa]** Only then begin the next capability.

**[ED-VSb]** Same principle as [GM-P2] — build end-to-end, not layer-by-layer across all features.

---

## ED-SCD — Small, Complete Deliverables

**[ED-SCD]** Every implementation should leave the platform in a **usable state**.

**[ED-SCDa]** Avoid large collections of partially implemented features.

**[ED-SCDb]** Each completed slice should provide **observable value**.

**[ED-SCDc]** Commit + deploy after each complete slice when possible.

---

## ED-SF — Stable Foundations

**[ED-SF]** Core systems should be implemented before advanced capabilities.

**Priority order:**

| Order | System |
|-------|--------|
| 1 | Identity |
| 2 | Registry |
| 3 | Relationships |
| 4 | Communities |
| 5 | Recruitment |
| 6 | Communication |
| 7 | Analytics |
| 8 | Enhancement |

*Aligns with [GM-P1] Foundation before features · [OM-L1] Individual as database root.*

---

## ED-DF — Documentation First

**[ED-DF]** Every significant capability should have:

- Purpose
- Requirements
- Architecture
- Acceptance criteria
- Future considerations
- Implementation notes

**[ED-DFa]** Documentation should explain **why** the capability exists — not only how it works.

**[ED-DFb]** Update `BUILD-LOG.md` and `build-progress.json` with every completed step.

---

## ED-ME — Modular Engineering

**[ED-ME]** Each subsystem should have clear responsibilities.

**Examples:** Authentication · Registry · Users · Networks · Events · Committees · Messaging · Analytics · Administration

**[ED-MEa]** Modules should minimize unnecessary coupling.

**[ED-MEb]** Aligns with [DG-013] Scalable Architecture · [DG-008] No Vendor Lock-In.

---

## ED-DB — Database Philosophy

**[ED-DB]** The database is the **authoritative source of truth**.

**[ED-DBa]** Data structures should:

- Support expansion
- Avoid duplication
- Preserve history where appropriate
- Allow future analytics
- Maintain referential integrity

*Aligns with [OM-L1] people-first model · [DG-009] Versioned Growth.*

---

## ED-UX — User Experience Philosophy

**[ED-UX]** Technology should disappear behind the organizing experience.

**[ED-UXa]** Participants should think about:

- Their campus
- Their county
- Their network
- Their projects

**[ED-UXb]** Not about software.

*Aligns with [DG-012] Human-Centered Technology · [LS-PX] Platform experience qualities.*

---

## ED-MF — Mobile-First Engineering

**[ED-MF]** Every capability should function well on **mobile** before desktop refinements.

**[ED-MFa]** Navigation should prioritize one-handed use.

**[ED-MFb]** Interfaces should minimize unnecessary complexity.

*Aligns with [LS-P5] Mobile Experience pillar.*

---

## ED-SEC — Security Philosophy

**[ED-SEC]** Protect participant trust.

**[ED-SECa]** Use appropriate authentication and authorization.

**[ED-SECb]** Validate input.

**[ED-SECc]** Protect sensitive data.

**[ED-SECd]** Follow the principle of least privilege.

**[ED-SECe]** Review security continuously as the platform evolves.

*Aligns with [DG-004] Youth Safety and Privacy.*

---

## ED-PERF — Performance Philosophy

**[ED-PERF]** Pages should load quickly.

**[ED-PERFa]** Navigation should feel immediate.

**[ED-PERFb]** Large datasets should be optimized.

**[ED-PERFc]** Growth should not require architectural redesign.

*Aligns with [DG-013] Scalable Architecture.*

---

## ED-VC — Version Compatibility

**[ED-VC]** Every release should:

- Preserve existing participant data whenever practical
- Avoid unnecessary breaking changes
- Support future migrations
- Document structural changes

*Aligns with [DG-009] Versioned Growth · [GM-ROAD].*

---

## ED-QS — Quality Standards

**[ED-QS]** Every completed capability should satisfy:

| Standard | Requirement |
|----------|-------------|
| Functional correctness | Meets approved requirements |
| Responsive design | Mobile-first [ED-MF] |
| Accessibility review | Inclusive participation [DG-011] |
| Performance review | [ED-PERF] |
| Security review | [ED-SEC] |
| Documentation completeness | [ED-DF] |
| Acceptance testing | Against step AC criteria |

---

## ED-IQ — Implementation Questions

**[ED-IQ]** Before writing code, ask:

| # | Question |
|---|----------|
| 1 | Has this been designed? |
| 2 | Is the architecture approved? |
| 3 | Does this align with the Constitution? |
| 4 | Does it strengthen organizing? |
| 5 | Can it scale? |
| 6 | Can future versions extend it? |

**[ED-IQa]** If any answer is **"no,"** pause implementation.

**[ED-IQb]** Also apply [NS-013] North Star filter and [CT-001] Constitutional Test.

---

## ED-BR — Burt's Responsibilities

**[ED-BR]** Burt should:

- Read the approved documentation first
- Identify implementation dependencies
- Implement one vertical capability at a time [ED-VS]
- Maintain documentation [ED-DF]
- Report implementation observations
- Recommend improvements
- **Never silently change approved design decisions**

*Violations → escalate to Steve for architectural review [BG-001].*

---

## ED-SR — Steve's Responsibilities

**[ED-SR]** Steve provides:

- Mission
- Vision
- Requirements
- Architecture approval
- Version priorities
- Strategic direction

**[ED-SRa]** Steve uploads build steps to Cursor one at a time.

**[ED-SRb]** Steve approves constitutional changes when guardrails conflict with features [PHASE-001.4].

---

## ED-FL — Feedback Loop

**[ED-FL]** After implementation:

1. Review
2. Observe
3. Improve
4. Version upward

**[ED-FLa]** Implementation should continuously refine — but **never replace** the approved vision without explicit architectural review.

*Aligns with [ED-001c] · [GM-002] Launch early. Learn quickly. Improve continuously.*

---

## ED-CC — Completion Criteria

**[ED-CC]** Implementation is complete when:

- The approved requirements are satisfied
- Acceptance criteria pass
- Documentation matches implementation
- The capability is stable
- The platform remains deployable
- Future expansion points remain available

---

## ED-FD — Burt's Final Deliverable

**[ED-FD]** Every completed implementation should conclude with:

| Item | Description |
|------|-------------|
| What was built | Concrete deliverables |
| What changed | Files, schema, routes |
| What was deferred | Explicitly out of scope |
| Known limitations | Honest constraints |
| Recommendations for Version 2 | Observations for next design cycle |

**[ED-FDa]** This creates a disciplined handoff back into the design process.

**[ED-FDb]** Record in `docs/build-log/BUILD-LOG.md`.

---

## AC-008 — Acceptance Criteria

Step 1.8 is complete when:

- [x] **[AC-008a]** The engineering methodology is documented. `[ED-002 through ED-FD]`
- [x] **[AC-008b]** Implementation lifecycle is defined. `[ED-LC, ED-001]`
- [x] **[AC-008c]** Roles and responsibilities are clear. `[ED-BR, ED-SR]`
- [x] **[AC-008d]** Quality standards are established. `[ED-QS]`
- [x] **[AC-008e]** Burt has a repeatable protocol for implementing every approved design. `[ED-GR, ED-VS, ED-IQ, ED-FD]`

---

## Phase 1 Completion

With Step **1.8**, **Phase 1 is complete**.

Phase 1 is the **Constitution of the Platform**. It defines:

| Step | Domain |
|------|--------|
| 1.1 | Identity |
| 1.2 | North Star |
| 1.3 | Core Principles |
| 1.4 | Boundaries |
| 1.5 | Organizing Model |
| 1.6 | Growth Strategy |
| 1.7 | Launch Success |
| 1.8 | Implementation Doctrine |

**Consolidated index:** [BUILD-BIBLE.md](BUILD-BIBLE.md)

At this point, Burt has a governing framework. **Phase 2** supplies implementation details — starting with the Arkansas Organizing Registry.

---

## Burt — Before Every Implementation Session

```
1. Read BUILD-BIBLE.md (or relevant step doc)
2. Apply ED-IQ implementation questions
3. Apply NS-013 North Star filter
4. Apply LS-010 launch filter (V1 scope)
5. Build vertically [ED-VS]
6. Update build-progress.json + BUILD-LOG.md
7. Commit with requirement IDs
8. Conclude with ED-FD deliverable summary
```

---

*Next: Phase 2 — Arkansas Organizing Registry · Optional Phase 1.9 — Master Traceability Matrix*
