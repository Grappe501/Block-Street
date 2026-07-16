# CAL-P2 Wave 5A Closeout

Event conflict detection and resolution engine — seed catalog, schedule overlap detection, resolution checklists.

**Claim:** TESTED · **Gate A:** OPEN · **Persistence:** session_soft_beta

## Scope

- Conflict kinds: schedule_overlap, kelly_travel, candidate_schedule, resource_overlap
- Seed conflict `conf-kelly-asu-buffer` links Kelly hold and Henderson VR drive
- Resolution checklist categories: review, communication, resolution
- `listConflicts()` wired to conflict engine store
- Attention keys: `unresolved_conflict`, `candidate_conflict` (existing)

## Command views

- Unresolved conflicts
- Candidate / Kelly conflicts
- Override candidates

## Next wave

CAL-P2 Wave 6A (TBD)
