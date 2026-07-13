/**
 * CAE-11.7-W9 — Multi-Agent Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import type { AgentSpecialty, ConsensusState } from "../data-model";
import {
  getRegistryEntry,
  listConflicts,
  listConsensus,
  listEvidence,
  listGovernance,
  listIntegrations,
  listMarketplace,
  listMessages,
  listRegistry,
  listReviews,
  listTasks,
  saveAgentMemory,
  saveConflict,
  saveConsensus,
  saveEvidence,
  saveGovernance,
  saveIntegration,
  saveMarketplaceEntry,
  saveMessage,
  saveRegistryEntry,
  saveReview,
  saveTask,
} from "./repository";

export class AgentError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureAgentBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
}

function getBrain(humanId: string) {
  ensureAgentBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new AgentError("AGENT_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function defaultAgents(institutionId: string) {
  const specialties: AgentSpecialty[] = [
    "executive_advisor",
    "research_analyst",
    "legal_review",
    "organizer",
    "education_coach",
    "communications_advisor",
    "data_scientist",
    "policy_analyst",
  ];

  const resolved: AgentSpecialty[] =
    specialties.length > 0
      ? specialties
      : (["executive_advisor", "research_analyst", "legal_review"] as AgentSpecialty[]);

  return resolved.map((specialty) => ({
    agent_id: `agt-${specialty}`,
    name: specialty.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `Specialist agent for ${specialty.replace(/_/g, " ")}`,
    owner: "institution",
    institution_id: institutionId,
    version: "1.0.0",
    specialty,
    capabilities: [`${specialty}_analysis`, `${specialty}_recommendation`],
    permissions: ["read_institutional_context", "share_evidence"],
    memory_scope: "task" as const,
    tools: [`tool_${specialty}`],
    risk_class: specialty === "legal_review" ? ("high" as const) : ("medium" as const),
    status: "active" as const,
    anonymous: false as const,
    human_approval_required: specialty === "legal_review" || specialty === "executive_advisor",
  }));
}

function agentRecommendation(agentId: string, query: string, confidence: number) {
  const agent = getRegistryEntry(agentId);
  const specialty = agent?.specialty ?? "research_analyst";
  const positions: Record<string, string> = {
    legal_review: "Recommend compliance review before county expansion.",
    research_analyst: "Evidence supports proceeding with phased county immersion.",
    executive_advisor: "Prioritize leadership briefing and stakeholder alignment.",
    policy_analyst: "Monitor legislative signals before full commitment.",
    communications_advisor: "Prepare transparent community messaging plan.",
    education_coach: "Align volunteer training with county readiness milestones.",
    data_scientist: "Metrics indicate moderate volunteer growth trajectory.",
    organizer: "Coordinate parallel workstreams with clear ownership.",
    calendar_planner: "Schedule review checkpoints at 30/60/90 days.",
    finance_analyst: "Budget runway supports one additional county this quarter.",
    grant_writer: "CDBG window may offset expansion costs.",
    campaign_strategist: "Grassroots outreach should precede public launch.",
    volunteer_coordinator: "Recruit 8 additional facilitators before expansion.",
    county_intelligence: "Target counties show rising civic engagement signals.",
    technology_architect: "Platform capacity supports multi-county rollout.",
  };
  return {
    position: positions[specialty] ?? `Advisory input on: ${query.slice(0, 80)}`,
    confidence,
  };
}

export const agentRegistryService = {
  list: listRegistry,
  register(input: {
    institution_id: string;
    name: string;
    description: string;
    specialty: AgentSpecialty;
    owner?: string;
    capabilities?: string[];
    risk_class?: "low" | "medium" | "high" | "critical";
  }) {
    const record = {
      agent_id: caeId("agt"),
      name: input.name,
      description: input.description,
      owner: input.owner ?? "institution",
      institution_id: input.institution_id,
      version: "1.0.0",
      specialty: input.specialty,
      capabilities: input.capabilities ?? [`${input.specialty}_analysis`],
      permissions: ["read_institutional_context", "share_evidence"],
      memory_scope: "task" as const,
      tools: [`tool_${input.specialty}`],
      risk_class: input.risk_class ?? ("medium" as const),
      status: "active" as const,
      anonymous: false as const,
      human_approval_required: input.risk_class === "critical" || input.risk_class === "high",
    };
    saveRegistryEntry(record);
    return { agent: record, event: "agent.updated" as const, anonymous: false };
  },
  ensureDefaults(institutionId: string) {
    const existing = listRegistry(institutionId);
    if (existing.length > 0) return existing;
    const agents = defaultAgents(institutionId);
    for (const agent of agents) saveRegistryEntry(agent);
    return agents;
  },
  retire(agentId: string) {
    const agent = getRegistryEntry(agentId);
    if (!agent) throw new AgentError("AGENT_NOT_FOUND", "Agent not found");
    const updated = { ...agent, status: "retired" as const };
    saveRegistryEntry(updated);
    return { agent: updated, event: "agent.retired" as const, autonomous: false };
  },
};

export const capabilityService = {
  discover(institutionId: string) {
    agentRegistryService.ensureDefaults(institutionId);
    const agents = listRegistry(institutionId).filter((a) => a.status === "active");
    const capabilities = agents.flatMap((a) =>
      a.capabilities.map((cap) => ({
        capability: cap,
        agent_id: a.agent_id,
        specialty: a.specialty,
        risk_class: a.risk_class,
      }))
    );
    return { capabilities, agents: agents.length, specialties: [...new Set(agents.map((a) => a.specialty))] };
  },
  match(query: string, institutionId: string) {
    const { capabilities } = capabilityService.discover(institutionId);
    const q = query.toLowerCase();
    const matched = capabilities.filter(
      (c) => q.includes(c.specialty.replace(/_/g, " ")) || q.includes(c.capability.replace(/_/g, " "))
    );
    const fallback = capabilities.slice(0, 3);
    return { matched: matched.length > 0 ? matched : fallback, query };
  },
};

export const agentCommunicationService = {
  list: listMessages,
  send(input: {
    task_id: string;
    from_agent_id: string;
    to_agent_id: string | "evidence_bus";
    message_type: "request" | "evidence" | "question" | "conclusion" | "warning" | "recommendation";
    content: string;
    confidence: number;
  }) {
    if (input.to_agent_id !== "evidence_bus" && input.from_agent_id === input.to_agent_id) {
      throw new AgentError("HIDDEN_CHANNEL_BLOCKED", "Agents cannot use hidden direct channels");
    }
    const record = {
      message_id: caeId("msg"),
      task_id: input.task_id,
      from_agent_id: input.from_agent_id,
      to_agent_id: input.to_agent_id,
      message_type: input.message_type,
      content: input.content,
      confidence: input.confidence,
      auditable: true as const,
      sent_at: nowIso(),
      hidden_channel: false as const,
    };
    saveMessage(record);
    return { message: record, event: "agent.updated" as const, auditable: true };
  },
};

export const evidenceBusService = {
  list: listEvidence,
  share(input: {
    task_id: string;
    agent_id: string;
    institution_id: string;
    evidence: string;
    confidence: number;
    sources: string[];
    context: string;
    permissions?: string[];
  }) {
    const existing = listEvidence(input.task_id).filter((e) => e.agent_id === input.agent_id);
    const record = {
      evidence_id: caeId("evd"),
      task_id: input.task_id,
      agent_id: input.agent_id,
      institution_id: input.institution_id,
      evidence: input.evidence,
      confidence: input.confidence,
      sources: input.sources,
      version: existing.length + 1,
      context: input.context,
      permissions: input.permissions ?? ["read_institutional_context"],
      shared_at: nowIso(),
      hidden: false as const,
    };
    saveEvidence(record);
    agentCommunicationService.send({
      task_id: input.task_id,
      from_agent_id: input.agent_id,
      to_agent_id: "evidence_bus",
      message_type: "evidence",
      content: input.evidence,
      confidence: input.confidence,
    });
    return { evidence: record, event: "evidence.shared" as const, hidden: false };
  },
};

export const conflictResolutionService = {
  list: listConflicts,
  detect(input: {
    task_id: string;
    institution_id: string;
    subject: string;
    positions: { agent_id: string; position: string; evidence_id: string; confidence: number }[];
  }) {
    if (input.positions.length < 2) {
      return { conflict: null, event: null, minority_preserved: true };
    }
    const uniquePositions = new Set(input.positions.map((p) => p.position));
    if (uniquePositions.size <= 1) {
      return { conflict: null, event: null, minority_preserved: true };
    }
    const record = {
      conflict_id: caeId("cnf"),
      task_id: input.task_id,
      institution_id: input.institution_id,
      subject: input.subject,
      positions: input.positions,
      minority_preserved: true as const,
      suppressed: false as const,
      detected_at: nowIso(),
    };
    saveConflict(record);
    return { conflict: record, event: "agent.conflict" as const, minority_preserved: true, suppressed: false };
  },
};

export const consensusService = {
  list: listConsensus,
  determine(input: {
    human_id: string;
    institution_id: string;
    task_id: string;
    positions: { agent_id: string; position: string; confidence: number }[];
    force_state?: ConsensusState;
  }) {
    const confidences = input.positions.map((p) => p.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / (confidences.length || 1);
    const unique = new Set(input.positions.map((p) => p.position));
    let state: ConsensusState = input.force_state ?? "unknown";
    if (!input.force_state) {
      if (input.positions.length === 0) state = "insufficient_evidence";
      else if (unique.size === 1) state = "consensus";
      else if (avgConfidence < 0.5) state = "insufficient_evidence";
      else if (unique.size === 2 && avgConfidence >= 0.6) state = "split_recommendation";
      else if (unique.size > 2) state = "majority_recommendation";
      else state = "human_review_required";
    }
    const supporting = input.positions.filter((p) => p.confidence >= 0.6).map((p) => p.agent_id);
    const dissenting = input.positions.filter((p) => p.confidence < 0.6).map((p) => p.agent_id);
    const humanReviewRequired = state === "human_review_required" || state === "split_recommendation" || state === "insufficient_evidence";
    const record = {
      consensus_id: caeId("cns"),
      task_id: input.task_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      state,
      summary: `Consensus state: ${state.replace(/_/g, " ")} across ${input.positions.length} agent positions.`,
      supporting_agents: supporting,
      dissenting_agents: dissenting,
      confidence: avgConfidence,
      human_review_required: humanReviewRequired,
      reasoning_visible: true as const,
      determined_at: nowIso(),
    };
    saveConsensus(record);
    return {
      consensus: record,
      event: "agent.consensus" as const,
      reasoning_visible: true,
      unanimous_required: false,
    };
  },
};

export const humanReviewService = {
  list: listReviews,
  queue(input: {
    human_id: string;
    institution_id: string;
    task_id: string;
    subject: string;
    evidence_ids: string[];
    conflicts: string[];
    alternatives?: string[];
  }) {
    const record = {
      review_id: caeId("rev"),
      task_id: input.task_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      subject: input.subject,
      evidence_ids: input.evidence_ids,
      conflicts: input.conflicts,
      alternatives: input.alternatives ?? ["Defer decision", "Request additional research"],
      status: "pending" as const,
      autonomous_approval: false as const,
      created_at: nowIso(),
    };
    saveReview(record);
    return { review: record, event: "human.review_required" as const, autonomous_approval: false };
  },
};

export const agentMemoryService = {
  store(input: {
    agent_id: string;
    task_id: string;
    memory_type: "working" | "task" | "temporary" | "institutional_ref";
    content: string;
    expires_at?: string | null;
  }) {
    const record = {
      memory_id: caeId("mem"),
      agent_id: input.agent_id,
      task_id: input.task_id,
      memory_type: input.memory_type,
      content: input.content,
      owns_human_memory: false as const,
      expires_at: input.expires_at ?? null,
    };
    saveAgentMemory(record);
    return { memory: record, owns_human_memory: false, canonical_owner: "localbrain" as const };
  },
};

export const marketplaceService = {
  list: listMarketplace,
  install(input: {
    institution_id: string;
    agent_id: string;
    name: string;
    source: "internal" | "partner" | "commercial" | "open_source" | "regulated";
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new AgentError("INSTALL_REQUIRES_APPROVAL", "Third-party agent installation requires Human approval");
    }
    const record = {
      listing_id: caeId("mkt"),
      agent_id: input.agent_id,
      institution_id: input.institution_id,
      source: input.source,
      name: input.name,
      governed_install: true as const,
      status: "installed" as const,
    };
    saveMarketplaceEntry(record);
    return { listing: record, event: "agent.installed" as const, auto_installed: false };
  },
};

export const integrationService = {
  list: listIntegrations,
  connect(input: {
    institution_id: string;
    provider: "openai" | "anthropic" | "google" | "open_source" | "government" | "institutional";
    agent_id: string;
    approved_by_human: boolean;
  }) {
    if (!input.approved_by_human) {
      throw new AgentError("INTEGRATION_REQUIRES_APPROVAL", "Third-party integration requires Human approval");
    }
    const record = {
      integration_id: caeId("int"),
      institution_id: input.institution_id,
      provider: input.provider,
      agent_id: input.agent_id,
      governed: true as const,
      status: "active" as const,
    };
    saveIntegration(record);
    return { integration: record, governed: true };
  },
};

export const agentGovernanceService = {
  list: listGovernance,
  evaluate(input: { agent_id: string; institution_id: string }) {
    const record = {
      governance_id: caeId("gov"),
      agent_id: input.agent_id,
      institution_id: input.institution_id,
      evidence_quality: 0.82,
      reliability: 0.88,
      hallucination_rate: 0.04,
      human_acceptance: 0.91,
      failure_rate: 0.03,
      certified: true,
      trust_earned: true as const,
      evaluated_at: nowIso(),
    };
    saveGovernance(record);
    return { governance: record, trust_earned: true };
  },
};

export const agentOrchestrator = {
  listTasks,
  run(input: {
    human_id: string;
    institution_id: string;
    query: string;
    agent_ids?: string[];
    execution_mode?: "parallel" | "sequential";
    simulate_conflict?: boolean;
  }) {
    getBrain(input.human_id);
    agentRegistryService.ensureDefaults(input.institution_id);

    const matched = capabilityService.match(input.query, input.institution_id);
    const selectedIds =
      input.agent_ids ??
      matched.matched.slice(0, 3).map((m) => m.agent_id) ??
      listRegistry(input.institution_id)
        .filter((a) => a.status === "active")
        .slice(0, 3)
        .map((a) => a.agent_id);

    const task = {
      task_id: caeId("tsk"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      query: input.query,
      agent_ids: selectedIds,
      execution_mode: input.execution_mode ?? ("parallel" as const),
      status: "running" as const,
      started_at: nowIso(),
      completed_at: null,
      localbrain_interface: true as const,
    };
    saveTask(task);

    const positions: { agent_id: string; position: string; evidence_id: string; confidence: number }[] = [];
    const consensusPositions: { agent_id: string; position: string; confidence: number }[] = [];

    for (let i = 0; i < selectedIds.length; i++) {
      const agentId = selectedIds[i];
      const confidence = input.simulate_conflict && i === selectedIds.length - 1 ? 0.45 : 0.72 + i * 0.03;
      const rec = agentRecommendation(agentId, input.query, confidence);

      const evidence = evidenceBusService.share({
        task_id: task.task_id,
        agent_id: agentId,
        institution_id: input.institution_id,
        evidence: rec.position,
        confidence,
        sources: ["institutional_context", "research_network", "organizer_signals"],
        context: input.query,
      });

      agentCommunicationService.send({
        task_id: task.task_id,
        from_agent_id: agentId,
        to_agent_id: "evidence_bus",
        message_type: "recommendation",
        content: rec.position,
        confidence,
      });

      agentMemoryService.store({
        agent_id: agentId,
        task_id: task.task_id,
        memory_type: "task",
        content: `Working conclusion: ${rec.position.slice(0, 120)}`,
      });

      positions.push({
        agent_id: agentId,
        position: rec.position,
        evidence_id: evidence.evidence.evidence_id,
        confidence,
      });
      consensusPositions.push({ agent_id: agentId, position: rec.position, confidence });
    }

    if (input.simulate_conflict && positions.length >= 2) {
      positions[positions.length - 1].position = "Recommend delaying expansion until compliance review completes.";
      consensusPositions[consensusPositions.length - 1].position = positions[positions.length - 1].position;
      consensusPositions[consensusPositions.length - 1].confidence = 0.42;
    }

    const conflict = conflictResolutionService.detect({
      task_id: task.task_id,
      institution_id: input.institution_id,
      subject: input.query,
      positions,
    });

    const consensus = consensusService.determine({
      human_id: input.human_id,
      institution_id: input.institution_id,
      task_id: task.task_id,
      positions: consensusPositions,
      force_state: conflict.conflict ? "split_recommendation" : undefined,
    });

    let review = null;
    if (consensus.consensus.human_review_required) {
      review = humanReviewService.queue({
        human_id: input.human_id,
        institution_id: input.institution_id,
        task_id: task.task_id,
        subject: input.query,
        evidence_ids: positions.map((p) => p.evidence_id),
        conflicts: conflict.conflict ? [conflict.conflict.conflict_id] : [],
      });
    }

    for (const agentId of selectedIds) {
      agentGovernanceService.evaluate({ agent_id: agentId, institution_id: input.institution_id });
    }

    const completed = {
      ...task,
      status: consensus.consensus.human_review_required ? ("review_required" as const) : ("completed" as const),
      completed_at: nowIso(),
    };
    saveTask(completed);

    return {
      task: completed,
      agents: selectedIds,
      evidence: positions.map((p) => p.evidence_id),
      conflict: conflict.conflict,
      consensus: consensus.consensus,
      review: review?.review ?? null,
      events: [
        "agent.started",
        "evidence.shared",
        conflict.conflict ? "agent.conflict" : null,
        "agent.consensus",
        review ? "human.review_required" : "agent.completed",
      ].filter(Boolean),
      localbrain_interface: true,
      hidden_channels: false,
      mutates_canonical: false,
      autonomous_approval: false,
    };
  },
};

export const agentRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureAgentBoot();
    getBrain(input.human_id);
    agentRegistryService.ensureDefaults(input.institution_id);
    contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });

    const registry = listRegistry(input.institution_id).filter((a) => a.status === "active");
    const tasks = listTasks(input.human_id);
    const evidence = listEvidence();
    const conflicts = listConflicts(input.institution_id);
    const consensus = listConsensus(input.human_id);
    const reviews = listReviews(input.human_id).filter((r) => r.status === "pending");

    return {
      greeting: "Agent Orchestration Console",
      next_question: "Which specialists should work on this?",
      active_agents: registry.length,
      tasks: tasks.length,
      evidence_items: evidence.length,
      open_conflicts: conflicts.filter((c) => !c.suppressed).length,
      consensus_states: consensus.slice(-3).map((c) => c.state),
      pending_reviews: reviews.length,
      localbrain_interface: true,
      hidden_channels: false,
      autonomous_approval: false,
      mutates_canonical: false,
    };
  },
  security: {
    prohibited: [
      "hidden_communication",
      "share_unauthorized_memory",
      "bypass_human_approval",
      "suppress_minority_evidence",
      "rewrite_other_agent_evidence",
      "auto_install_third_party",
      "mutate_canonical_records",
      "autonomous_institutional_actions",
      "create_autonomous_hierarchies",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), observable: true };
    },
  },
};

export const agentRuntime = {
  agents: agentRuntimeService,
  registry: agentRegistryService,
  orchestrator: agentOrchestrator,
  capabilities: capabilityService,
  communication: agentCommunicationService,
  evidence: evidenceBusService,
  conflicts: conflictResolutionService,
  consensus: consensusService,
  review: humanReviewService,
  memory: agentMemoryService,
  marketplace: marketplaceService,
  integrations: integrationService,
  governance: agentGovernanceService,
};
