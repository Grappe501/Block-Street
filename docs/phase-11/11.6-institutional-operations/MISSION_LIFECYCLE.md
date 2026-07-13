# Mission Lifecycle

13 governed states: draft → planning → awaiting_approval → approved → scheduled → ready → in_progress → paused | blocked | escalated → review → completed → archived.

Illegal transitions are rejected. Every transition is audited in `ops_mission_transition_audits`.

See `src/lib/civic-action/builds/11.6/execution/state-machines.ts`.
