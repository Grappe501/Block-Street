/**
 * CAE-11.7-W9 — Seed multi-agent defaults
 */
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { readStoreSlice } from "./repository";
import { AGENT_STORE_KEYS } from "../data-model";
import { agentRuntime } from "./agent-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedAgentsIfEmpty() {
  seedPredictionIfEmpty();
  if (readStoreSlice(AGENT_STORE_KEYS.registry).length > 0) return false;

  agentRuntime.registry.ensureDefaults(INSTITUTION);

  agentRuntime.orchestrator.run({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    query: "Should we expand county immersion to three additional counties this quarter?",
    execution_mode: "parallel",
  });

  agentRuntime.marketplace.install({
    institution_id: INSTITUTION,
    agent_id: "agt-research_analyst",
    name: "Research Analyst (Internal)",
    source: "internal",
    approved_by_human: true,
  });

  agentRuntime.integrations.connect({
    institution_id: INSTITUTION,
    provider: "anthropic",
    agent_id: "agt-executive_advisor",
    approved_by_human: true,
  });

  return true;
}
