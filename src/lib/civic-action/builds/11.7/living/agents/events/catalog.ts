/**
 * CAE-11.7-W9 — Multi-Agent events
 */
export const AGENT_EVENT_CATALOG = [
  { event: "agent.started", domain: "agent", description: "Specialist agent began task execution" },
  { event: "agent.completed", domain: "agent", description: "Agent completed task with evidence" },
  { event: "agent.failed", domain: "agent", description: "Agent task failed with recoverable error" },
  { event: "agent.conflict", domain: "conflict", description: "Agents disagree with evidence preserved" },
  { event: "agent.consensus", domain: "consensus", description: "Consensus state determined for Human review" },
  { event: "agent.installed", domain: "marketplace", description: "Agent installed through governance" },
  { event: "agent.retired", domain: "governance", description: "Agent retired from active service" },
  { event: "agent.updated", domain: "registry", description: "Agent registry entry updated" },
  { event: "evidence.shared", domain: "evidence", description: "Evidence shared on governed Evidence Bus" },
  { event: "human.review_required", domain: "review", description: "High-impact output queued for Human review" },
] as const;
