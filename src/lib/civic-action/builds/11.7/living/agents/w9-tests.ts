/**
 * CAE-11.7-W9 — Multi-Agent tests
 */
import { agentRuntime } from "./services/agent-service";
import { seedAgentsIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getAgentConstitution, LIX_AGENT_PRINCIPLE, REQUIRED_AGENT_SERVICES } from "./constitution";
import { checkLixW9Invariants } from "./invariants";
import { explainAgentAction } from "./traceability";
import { AGENT_EVENT_CATALOG } from "./events/catalog";

export type LixW9TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW9CertificationTests(): LixW9TestResult[] {
  seedAgentsIfEmpty();
  const results: LixW9TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getAgentConstitution();
  results.push({ name: "agent_principle", passed: constitution.governing_principle === LIX_AGENT_PRINCIPLE });

  results.push({
    name: "required_agent_services",
    passed: REQUIRED_AGENT_SERVICES.length === 12,
    detail: `${REQUIRED_AGENT_SERVICES.length} services`,
  });

  results.push({ name: "w9_invariants", passed: checkLixW9Invariants().every((i) => i.passed) });

  results.push({
    name: "agent_event_catalog",
    passed: AGENT_EVENT_CATALOG.length >= 9,
    detail: `${AGENT_EVENT_CATALOG.length} events`,
  });

  const dashboard = agentRuntime.agents.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "agent_dashboard",
    passed: dashboard.localbrain_interface === true && dashboard.autonomous_approval === false,
    detail: dashboard.greeting,
  });

  const registry = agentRuntime.registry.ensureDefaults(institutionId);
  results.push({
    name: "agent_registry",
    passed: registry.length >= 3 && registry.every((a) => a.anonymous === false),
    detail: `${registry.length} agents`,
  });

  const capabilities = agentRuntime.capabilities.discover(institutionId);
  results.push({
    name: "capability_discovery",
    passed: capabilities.capabilities.length > 0 && capabilities.agents >= 3,
    detail: `${capabilities.capabilities.length} capabilities`,
  });

  const run = agentRuntime.orchestrator.run({
    human_id: humanId,
    institution_id: institutionId,
    query: "Evaluate county expansion readiness with legal and research review",
    execution_mode: "parallel",
    simulate_conflict: true,
  });
  results.push({
    name: "orchestrator_run",
    passed: run.localbrain_interface === true && run.agents.length >= 2,
    detail: run.task.task_id,
  });

  results.push({
    name: "evidence_bus_governed",
    passed: run.hidden_channels === false && run.evidence.length >= 2,
    detail: `${run.evidence.length} evidence items`,
  });

  results.push({
    name: "conflict_preserved",
    passed: !!run.conflict && run.conflict.minority_preserved === true && run.conflict.suppressed === false,
    detail: run.conflict?.conflict_id ?? "no conflict",
  });

  results.push({
    name: "consensus_not_unanimous_only",
    passed: run.consensus.reasoning_visible === true && run.consensus.state !== "unknown",
    detail: run.consensus.state,
  });

  results.push({
    name: "human_review_gateway",
    passed: run.review !== null && run.review.autonomous_approval === false,
    detail: run.review?.review_id ?? "none",
  });

  const message = agentRuntime.communication.send({
    task_id: run.task.task_id,
    from_agent_id: run.agents[0],
    to_agent_id: "evidence_bus",
    message_type: "question",
    content: "Request additional county readiness evidence",
    confidence: 0.7,
  });
  results.push({
    name: "auditable_communication",
    passed: message.auditable === true && message.message.hidden_channel === false,
    detail: message.message.message_id,
  });

  let hiddenBlocked = false;
  try {
    agentRuntime.communication.send({
      task_id: run.task.task_id,
      from_agent_id: run.agents[0],
      to_agent_id: run.agents[0],
      message_type: "request",
      content: "hidden direct channel",
      confidence: 0.5,
    });
  } catch {
    hiddenBlocked = true;
  }
  results.push({ name: "no_hidden_channels", passed: hiddenBlocked, detail: "hidden channel blocked" });

  const memory = agentRuntime.memory.store({
    agent_id: run.agents[0],
    task_id: run.task.task_id,
    memory_type: "task",
    content: "Temporary task context for county review",
  });
  results.push({
    name: "agent_memory_scoped",
    passed: memory.owns_human_memory === false && memory.canonical_owner === "localbrain",
    detail: memory.memory.memory_id,
  });

  let installBlocked = false;
  try {
    agentRuntime.marketplace.install({
      institution_id: institutionId,
      agent_id: "agt-external",
      name: "Unapproved External Agent",
      source: "commercial",
      approved_by_human: false,
    });
  } catch {
    installBlocked = true;
  }
  results.push({ name: "marketplace_requires_approval", passed: installBlocked, detail: "install blocked" });

  const install = agentRuntime.marketplace.install({
    institution_id: institutionId,
    agent_id: "agt-policy_analyst",
    name: "Policy Analyst Extension",
    source: "partner",
    approved_by_human: true,
  });
  results.push({
    name: "governed_marketplace_install",
    passed: install.auto_installed === false && install.listing.governed_install === true,
    detail: install.listing.listing_id,
  });

  const integration = agentRuntime.integrations.connect({
    institution_id: institutionId,
    provider: "openai",
    agent_id: run.agents[0],
    approved_by_human: true,
  });
  results.push({
    name: "third_party_integration",
    passed: integration.governed === true,
    detail: integration.integration.integration_id,
  });

  const governance = agentRuntime.governance.evaluate({
    agent_id: run.agents[0],
    institution_id: institutionId,
  });
  results.push({
    name: "agent_governance",
    passed: governance.trust_earned === true && governance.governance.certified === true,
    detail: `${governance.governance.reliability}`,
  });

  const consensus = agentRuntime.consensus.determine({
    human_id: humanId,
    institution_id: institutionId,
    task_id: run.task.task_id,
    positions: [
      { agent_id: "a1", position: "Proceed", confidence: 0.8 },
      { agent_id: "a2", position: "Proceed", confidence: 0.75 },
    ],
  });
  results.push({
    name: "consensus_state_consensus",
    passed: consensus.consensus.state === "consensus" && consensus.unanimous_required === false,
    detail: consensus.consensus.state,
  });

  const security = agentRuntime.agents.security.check("bypass_human_approval");
  results.push({ name: "agent_security", passed: security.allowed === false, detail: "approval bypass blocked" });

  const trace = explainAgentAction({
    human_id: humanId,
    action_type: "orchestrate",
    task_id: run.task.task_id,
  });
  results.push({
    name: "agent_traceability",
    passed: trace.includes("One Human decision-maker"),
    detail: "explainable",
  });

  results.push({
    name: "no_canonical_mutation",
    passed: run.mutates_canonical === false,
    detail: "advisory only",
  });

  return results;
}

export function allLixW9TestsPassed(): boolean {
  return runLixW9CertificationTests().every((t) => t.passed);
}
