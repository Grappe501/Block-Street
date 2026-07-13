/**
 * CAE-11.7-W9 — Multi-Agent data model
 */
import type { AGENT_SPECIALTIES, CONSENSUS_STATES } from "./constitution";

export type AgentSpecialty = (typeof AGENT_SPECIALTIES)[number];
export type ConsensusState = (typeof CONSENSUS_STATES)[number];

export const AGENT_STORE_KEYS = {
  registry: "lix_agent_registry",
  tasks: "lix_agent_tasks",
  messages: "lix_agent_messages",
  evidence: "lix_agent_evidence",
  conflicts: "lix_agent_conflicts",
  consensus: "lix_agent_consensus",
  reviews: "lix_agent_reviews",
  memory: "lix_agent_memory",
  marketplace: "lix_agent_marketplace",
  integrations: "lix_agent_integrations",
  governance: "lix_agent_governance",
} as const;

export interface AgentRegistryEntry {
  agent_id: string;
  name: string;
  description: string;
  owner: string;
  institution_id: string;
  version: string;
  specialty: AgentSpecialty;
  capabilities: string[];
  permissions: string[];
  memory_scope: "task" | "working" | "institutional_ref";
  tools: string[];
  risk_class: "low" | "medium" | "high" | "critical";
  status: "active" | "degraded" | "retired" | "pending_install";
  anonymous: false;
  human_approval_required: boolean;
}

export interface AgentTaskRecord {
  task_id: string;
  human_id: string;
  institution_id: string;
  query: string;
  agent_ids: string[];
  execution_mode: "parallel" | "sequential";
  status: "pending" | "running" | "completed" | "failed" | "review_required";
  started_at: string;
  completed_at: string | null;
  localbrain_interface: true;
}

export interface AgentMessageRecord {
  message_id: string;
  task_id: string;
  from_agent_id: string;
  to_agent_id: string | "evidence_bus";
  message_type: "request" | "evidence" | "question" | "conclusion" | "warning" | "recommendation";
  content: string;
  confidence: number;
  auditable: true;
  sent_at: string;
  hidden_channel: false;
}

export interface EvidenceBusRecord {
  evidence_id: string;
  task_id: string;
  agent_id: string;
  institution_id: string;
  evidence: string;
  confidence: number;
  sources: string[];
  version: number;
  context: string;
  permissions: string[];
  shared_at: string;
  hidden: false;
}

export interface ConflictRecord {
  conflict_id: string;
  task_id: string;
  institution_id: string;
  subject: string;
  positions: { agent_id: string; position: string; evidence_id: string; confidence: number }[];
  minority_preserved: true;
  suppressed: false;
  detected_at: string;
}

export interface ConsensusRecord {
  consensus_id: string;
  task_id: string;
  institution_id: string;
  human_id: string;
  state: ConsensusState;
  summary: string;
  supporting_agents: string[];
  dissenting_agents: string[];
  confidence: number;
  human_review_required: boolean;
  reasoning_visible: true;
  determined_at: string;
}

export interface HumanReviewRecord {
  review_id: string;
  task_id: string;
  human_id: string;
  institution_id: string;
  subject: string;
  evidence_ids: string[];
  conflicts: string[];
  alternatives: string[];
  status: "pending" | "approved" | "rejected" | "deferred";
  autonomous_approval: false;
  created_at: string;
}

export interface AgentMemoryRecord {
  memory_id: string;
  agent_id: string;
  task_id: string;
  memory_type: "working" | "task" | "temporary" | "institutional_ref";
  content: string;
  owns_human_memory: false;
  expires_at: string | null;
}

export interface MarketplaceEntry {
  listing_id: string;
  agent_id: string;
  institution_id: string;
  source: "internal" | "partner" | "commercial" | "open_source" | "regulated";
  name: string;
  governed_install: true;
  status: "available" | "installed" | "retired";
}

export interface IntegrationRecord {
  integration_id: string;
  institution_id: string;
  provider: "openai" | "anthropic" | "google" | "open_source" | "government" | "institutional";
  agent_id: string;
  governed: true;
  status: "active" | "disabled";
}

export interface AgentGovernanceRecord {
  governance_id: string;
  agent_id: string;
  institution_id: string;
  evidence_quality: number;
  reliability: number;
  hallucination_rate: number;
  human_acceptance: number;
  failure_rate: number;
  certified: boolean;
  trust_earned: true;
  evaluated_at: string;
}
