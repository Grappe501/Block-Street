# AI Conversation Intelligence Runtime — CAE-11.7-W6 (LIX-006)

**Principle:** The platform remembers conversations so Humans do not have to—but only when the Humans have authorized it to remember.

## Services (13)

ConversationService · ConsentService · RecordingService · SpeakerIdentificationService · TranscriptionService · TranslationService · ConversationIntelligenceService · MeetingMemoryService · DecisionDetectionService · CommitmentDetectionService · ActionSuggestionService · DialogueGraphService · ConversationSearchService

## APIs

| Method | Path |
|--------|------|
| GET | `/api/v1/localbrain/conversations` |
| GET | `/api/v1/localbrain/conversations/meetings` |
| GET/POST | `/api/v1/localbrain/conversations/transcripts` |
| GET | `/api/v1/localbrain/conversations/decisions` |
| GET | `/api/v1/localbrain/conversations/commitments` |
| GET | `/api/v1/localbrain/conversations/dialogue` |
| GET | `/api/v1/localbrain/conversations/search` |
| POST | `/api/v1/localbrain/conversations/import` |
| POST | `/api/v1/localbrain/conversations/summarize` |
| POST | `/api/v1/localbrain/conversations/promote` |

```bash
npm run phase11:11.7:w6
npm run conversations:validate
```
