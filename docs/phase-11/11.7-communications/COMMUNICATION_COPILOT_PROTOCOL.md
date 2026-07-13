# Communication Copilot Protocol

**Protocol ID:** CAE-11.7-W6 · **Subsystem:** COM-INT-001

## Governance

The communication copilot **recommends and explains only**. It cannot:

- Approve or record decisions
- Send or post messages
- Archive conversations or publish documents
- Assign action items or invite humans

## Endpoints

- `POST /api/v1/ai/communications/query` — read-only natural language queries
- `POST /api/v1/ai/communications/explain` — read-only insight explanations

All responses include `advisory_only: true` and a governance note.
