# Research & Policy Lab

**System ID:** RPL-001 · Build 10.7 · AC-200

Privacy-protected civic research that informs policy without exposing individuals.

## Guiding Principle

> Research serves communities. It never extracts from them without consent, aggregation, and audit.

## Capabilities

- Research workspace registry with purpose, sponsor institution, and retention
- Privacy gate — individual-level export prohibited; aggregates only
- Dataset requests with minimum cohort size and suppression rules
- Policy brief drafts grounded in Civic Outcomes + Strategic Intelligence evidence
- Human review before external publication or partner share
- Research audit ledger (who asked, what was released, why)
- Federation: authorized aggregate research packs only

## Architectural Locks

| Lock | Rule |
|------|------|
| No row-level PII in research exports | Suppression + k-anonymity floor |
| Human approval for external release | Reviewer required |
| Purpose limitation | Stated research question bound to workspace |
| Explainable sourcing | Briefs cite CIV/OUT/CHD/INT engines |

**Engine:** `src/lib/research-policy-lab/` · **Registry:** `data/registry/research-policy-lab.json`  
**Admin:** Phase 10 Civic Growth tab · `AdminResearchPolicyLab`

**Acceptance:** AC-200
