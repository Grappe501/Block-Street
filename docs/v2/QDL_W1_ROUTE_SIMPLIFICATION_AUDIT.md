# QDL-W1 Route Simplification Audit

**Build:** BLOCK-STREET-QUIET-DAILY-LIFE-1.0 — QDL-W1  
**Audited:** 2026-07-16T06:53:45.082Z

## Summary

| Metric | Count |
|--------|------:|
| Total page routes | 421 |
| Everyday | 7 |
| Occasional | 231 |
| Leadership | 146 |
| Director | 18 |
| Engineering / Debug | 19 |

## Key everyday routes

- `/choose-place` — Lock county or campus organizing home
- `/county/[slug]/calendar` — County-local organizing hub
- `/county/[slug]` — County-local organizing hub
- `/home` — Personal daily loop — next action, place, team, meetings
- `/network` — Share recruiting board and track people you invited
- `/notifications` — Supporting surface — see route path
- `/calendar` — See what is coming up and volunteer shifts

## Priority simplification targets (W1)

- `/home` → redirect (everyday surface for participant audience)
- `/start` → hide_from_nav (occasional surface for unknown audience)
- `/network` → simplify (everyday surface for participant audience)
- `/directory` → redirect (occasional surface for participant audience)
- `/leader/[leadershipAssignmentId]` → move_to_leadership (leadership surface for leader audience)
- `/college/[collegeSlug]/calendar/list` → keep (occasional surface for unknown audience)
- `/college/[collegeSlug]/calendar/month` → keep (occasional surface for unknown audience)
- `/college/[collegeSlug]/calendar` → keep (occasional surface for unknown audience)
- `/county/[slug]/calendar/list` → simplify (occasional surface for participant audience)
- `/county/[slug]/calendar/month` → simplify (occasional surface for participant audience)
- `/county/[slug]/calendar` → keep (everyday surface for participant audience)
- `/admin/college-command/meeting/july-14/commitments` → move_to_director (director surface for director audience)
- `/admin/college-command/meeting/july-14` → move_to_director (director surface for director audience)
- `/admin/college-command` → move_to_director (director surface for director audience)
- `/command/outreach` → move_to_leadership (leadership surface for leader audience)
- `/command/events/approvals` → move_to_leadership (leadership surface for leader audience)
- `/command/events/at-risk` → move_to_leadership (leadership surface for leader audience)
- `/command/events/attention` → move_to_leadership (leadership surface for leader audience)

## Director / engineering separation

Ordinary users must not reach engineering routes through nav. Director truth remains at `/admin/director` and `/admin?tab=command`.

See `data/qdl/qdl-w1-route-audit.json` for full classification.
