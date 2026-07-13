# Translation and AI Tutor Services

**Protocol:** CAE-11.12-W3

## Translation commands

- `CreateKnowledgeTranslationDraft` — records `source_version` at creation
- `ApproveKnowledgeTranslation` — blocked if `is_stale` after source version bump

## AI suggestion commands

- `CreateAIKnowledgeSuggestion` — Human-initiated, `does_not_create_truth: true`
- `ReviewAIKnowledgeSuggestion` — Human accept/reject; never auto-creates canonical artifact

## AI boundaries

AI cannot publish artifacts or certify competency. Suggestions remain non-canonical until a Human creates/approves a draft artifact through the full lifecycle.

## Services

`KnowledgeTranslationService`, `TranslationStalenessService`, `AIKnowledgeSuggestionService`, `AIKnowledgeReviewService`, `TutorConversationService`
