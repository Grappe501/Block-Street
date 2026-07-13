# Knowledge Overlap Audit — ADP-001 vs COM-002

**Protocol:** CAE-11.12-W2 · **Date:** 2026-07-12

## Purpose

Document overlap between Build 11.12 (ADP-001) and Build 11.7 (COM-002) knowledge capabilities. **ADP-001 must not duplicate COM-002 conversation knowledge as competing canonical IDs.**

## COM-002 owns (11.7)

| Entity | Store key | Scope |
|--------|-----------|-------|
| Conversation | `communication_conversations` | Institutional communications |
| Message | `communication_messages` | Thread content |
| Communication Knowledge | `communication_knowledge` | Knowledge captured from conversations |
| AISummary | `communication_ai_summaries` | Conversation summaries |
| Knowledge graph / capture / explorer | W6 intelligence layer | Communication-derived relationships |

## ADP-001 owns (11.12)

| Entity | Store key | Scope |
|--------|-----------|-------|
| KnowledgeArtifact | `knowledge_artifacts` | Canonical institutional knowledge |
| KnowledgeClaim | `knowledge_claims` | Evidence-backed institutional facts |
| Course / Module / Lesson | `knowledge_courses` etc. | Learning academy |
| Competency / Certification | `knowledge_competencies` etc. | Demonstrated capability |
| TutorConversation | `knowledge_tutor_conversations` | AI tutor (learning context, not COM-002 chat) |
| InstitutionalMemoryRecord | `knowledge_institutional_memory` | Long-horizon institutional memory |

## Boundary rules

1. **No ID collision:** COM-002 `Knowledge` records use `communication_knowledge` namespace. ADP-001 uses `knowledge_*` namespace.
2. **Reference, don't duplicate:** Conversation-captured insights may be **referenced** by ADP-001 `InstitutionalLesson` via `source_entity_id` pointing to COM-002 entity — never re-canonicalized.
3. **Tutor vs Conversation:** `TutorConversation` (ADP-001) is learning-scoped. `Conversation` (COM-002) is institutional communications.
4. **AI suggestions:** `AIKnowledgeSuggestion` (ADP-001) requires human review; does not create truth. COM-002 `AISummary` summarizes conversations only.

## Cross-build integration (planned W5+)

- COM-002 capture → ADP-001 lesson promotion workflow
- ADP-001 competency gaps → COM-002 knowledge explorer queries
- Shared search projection with distinct entity namespaces

## Audit conclusion

Overlap is **complementary**, not competing. W2 establishes namespace separation and reference-only bridging from COM-002 to ADP-001.
