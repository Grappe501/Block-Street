# VOLUME 3 — User Experience Bible

**Document ID:** VOLUME-003 · **UXB-001**  
**Artifact:** `USER_EXPERIENCE_BIBLE.md`  
**Status:** Canonical · v1 Structure  
**Priority:** Critical — no UX decisions left to invent at code time  
**Live spec:** `data/registry/user-experience-bible.json`

> Define **every screen, dashboard, navigation flow, and interaction state** before Burt writes UI code.

**Governed by:** [Volume 0](MASTER_ARCHITECTURE_BIBLE.md) [MAB-I · MAB-J] · [Volume 1 Ch.7](ENGINEERING_ARCHITECTURE_BIBLE.md)  
**Feeling layer:** [Volume 6 — Experience Design Bible](EXPERIENCE_DESIGN_BIBLE.md) [EDB-001]

---

## UXB-M01 — Purpose

**[UXB-M01]** When implementation begins, **layout, navigation, responsive behavior, and state patterns are already decided**.

**[UXB-M01a]** Volume 3 = **screens and flows**. Volume 6 = **how those screens should feel**.

---

## Platform Surfaces

| Surface | Route pattern | Primary doc |
|---------|---------------|-------------|
| Personal HQ | `/hq` | PHQ-001 |
| Command Center | `/command` | PCC-001 |
| Community HQ | `/community/{slug}` | CCC-001 |
| Mission HQ | `/mission/{id}` | MPS-001 |
| Opportunity Board | `/opportunities` | OEX-001 |
| Story Atlas | `/stories` | CST-001 |
| Growth Dashboard | `/growth` | CGO-001 |
| Public Explorer | `/explore` | PCN-001 |
| Admin Workbench | `/admin` | ADM-* |
| Registration | `/join` | WBS-001 · USR-001 |

---

## Navigation Architecture [UXB-C01]

**[UXB-C01a]** **Mobile:** Bottom tab bar — Home · Communities · Opportunities · Messages · Me.

**[UXB-C01b]** **Tablet:** Bottom tabs + collapsible side context panel.

**[UXB-C01c]** **Desktop:** Persistent left nav (context-aware) + main content + optional right insight panel.

**[UXB-C01d]** **Context switching:** Community scope always visible in header · one tap to switch home community.

---

## Dashboard Inventory [UXB-C02]

Every dashboard follows: **Pulse header · Primary actions · Modular widgets · Activity feed · Empty state with next step**.

| Dashboard | Widget source | Signature element |
|-----------|---------------|-------------------|
| Personal HQ | PHQ-M05 eight sections | Three login questions |
| Community Command | CCC-M05 twelve widgets | Community Pulse |
| Mission HQ | MPS-001 | Mission Canvas summary |
| Initiative Command | IOS-001 | Coordination map |
| Growth Readiness | GOS-001 | Readiness level badge |
| Network Twin | NISS-001 | Scoped graph view |
| Operations Center | OPIS-001 | Situational brief |

---

## Responsive Standards [UXB-C03]

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Single column · bottom nav · full-width cards |
| Tablet | 768–1024px | Two column where appropriate |
| Desktop | > 1024px | Multi-column dashboards · side panels |

**Touch:** 44px minimum targets · swipe for dismiss · pull-to-refresh on feeds.

---

## Interaction Patterns [UXB-C04]

**[UXB-C04a]** **Progressive disclosure:** Show summary → expand detail → link to full entity.

**[UXB-C04b]** **Empty states:** Always explain why empty + one primary action + illustration tone (warm, not corporate).

**[UXB-C04c]** **Loading:** Skeleton screens · never spinners alone on dashboards.

**[UXB-C04d]** **Errors:** Human message · retry action · support path · never raw error codes to users.

**[UXB-C04e]** **Forms:** Inline validation · save draft · mobile keyboard types correct.

---

## Accessibility [UXB-C05]

WCAG 2.1 AA: semantic HTML · focus order · skip links · color contrast 4.5:1 · screen reader labels on all icons · reduced motion respect.

---

## Visual Identity [UXB-C06]

**[UXB-C06a]** Arkansas-rooted · warm · trustworthy · youth-led · not corporate SaaS.

**[UXB-C06b]** Typography, spacing, color tokens defined in design system [EAB-C07] — community theming via CSS variables (primary/secondary from CID-001).

**[UXB-C06c]** Photography: real communities · consent required · diverse representation.

---

## Screen Catalog (v1 index) [UXB-C07]

Expand each to full wireframe spec in v1.1+:

1. Landing / public home [PCN-001]
2. Join / registration flows [ICS-001 · WBS-001]
3. Personal HQ eight sections [PHQ-001]
4. Morning Brief [PCC-001]
5. Relationship network view [PRN-001]
6. Invite builder [ICS-001]
7. Community home + pulse [CCC-001]
8. Mission canvas + library [MDS-001]
9. Volunteer passport [VDS-001]
10. Event experience HQ [EEOS-001]
11. Story composer + atlas [CST-001]
12. Opportunity marketplace [OBE-001]
13. Trust center [TPS-001]
14. Foundry launch wizard [CEF-001]
15. Network readiness [GOS-001]

---

## AC-079 — Acceptance Criteria

- [x] **[AC-079a]** Platform surfaces and navigation architecture defined. `[UXB-C01]`
- [x] **[AC-079b]** Dashboard inventory and responsive standards documented. `[UXB-C02, C03]`
- [x] **[AC-079c]** Interaction, accessibility, and visual identity standards set. `[UXB-C04–C06]`
- [x] **[AC-079d]** Screen catalog indexed for expansion. `[UXB-C07]`
- [ ] **[AC-079e]** Full wireframes for all 15+ screens (v1.1+).

---

**End of Volume 3 v1.**
