# V2-A Participation Goal Forensic Report

**Date:** 2026-07-14  
**Focus route:** `/schools/henderson-state`  
**Machine twin:** `data/v2/participation-goal-forensic-report.json`

## Displayed symptom

Henderson State workspace showed a prominent **6** near vote participation progress (`current / target`).

## What the 6 actually was

| Field | Value |
|-------|------:|
| Displayed | **6** |
| Role | **Fabricated current count**, not the goal |
| Goal (vote target) | **~120** (`round(160 × 0.75)`) |
| Registration target | **160** (`max(50, round(3190 × 0.05))`) |

### Canonical source

`src/lib/community-workspace/engine.ts` → `defaultGoals()` (pre-fix):

```text
voteCurrent = Math.round(voteTarget * 0.05)
```

With Henderson enrollment **3190** and defaults from `data/communities/workspace-seeds.json`:

```text
regTarget  = max(50, round(3190 × 0.05)) = 160
voteTarget = round(160 × 0.75)            = 120
fakeCurrent = round(120 × 0.05)           = 6
```

### Was it aliases?

**No.** The six was a **mock percentage**, not `COUNT(accounts)` or alias inflation. Separately, Henderson seed truth is:

| Metric | Value |
|--------|------:|
| Confirmed people (canonical) | 1 |
| System identities | 2 |
| Aliases | collapse to same canonical person |

## Goal vs people

| Concept | Pre-fix | Post-fix |
|---------|-----------|------------|
| Launch-team **goal** | Not labeled; confused with current | **6** = `minimum_launch_team` |
| Confirmed participants | Fake **6** | **1** |
| Remaining need | Misleading | **5** |
| How calculated | Hidden | Disclosure in UI |

## Recommended correction (shipped)

1. Remove mock `× 0.05` / `× 0.08` current inventing.
2. Count people with `COUNT(DISTINCT canonical_person_id)`.
3. Label launch goal: “Initial launch-team goal: 6 people.”
4. Show Goal / Confirmed / Still needed / system identities separately.

## Tests

`npm run test:v2a-participation` — proves alias dedupe, Henderson 1/6/5, co-leads, type change without duplicate membership, legacy six forensic.
