# Object Event Standard

**Protocol:** CAE-11.2-W2 · **Catalog:** `data/phase-11/objective_event_catalog.json`

Each entity emits versioned domain events. Examples: ObjectiveCreated, ObjectiveApproved, MissionStarted, TaskCompleted, EvidenceAdded, ReviewCompleted.

Events backbone automation (W5). Replay must not re-execute commands (INI-001 pattern).

Publisher: `CanonicalEventPublisher` (W3).
