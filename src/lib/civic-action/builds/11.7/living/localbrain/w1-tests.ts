/**
 * CAE-11.7-W1 — LocalBrain tests
 */
import { localBrainRuntime } from "./services/localbrain-service";
import { seedLocalBrainIfEmpty } from "./services/seed";
import { getLocalBrainConstitution, LIX_LOCALBRAIN_PRINCIPLE, REQUIRED_LOCALBRAIN_SERVICES } from "./constitution";
import { checkLixW1Invariants } from "./invariants";
import { explainLocalBrainAction } from "./traceability";
import { LOCALBRAIN_EVENT_CATALOG } from "./events/catalog";

export type LixW1TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW1CertificationTests(): LixW1TestResult[] {
  seedLocalBrainIfEmpty();
  const results: LixW1TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  const constitution = getLocalBrainConstitution();
  results.push({ name: "localbrain_principle", passed: constitution.governing_principle === LIX_LOCALBRAIN_PRINCIPLE });

  results.push({
    name: "required_localbrain_services",
    passed: REQUIRED_LOCALBRAIN_SERVICES.length === 15,
    detail: `${REQUIRED_LOCALBRAIN_SERVICES.length} services`,
  });

  results.push({ name: "w1_invariants", passed: checkLixW1Invariants().every((i) => i.passed) });

  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  results.push({
    name: "localbrain_provisioned",
    passed: !!brain && brain.human_id === humanId,
    detail: brain?.localbrain_id,
  });

  const duplicate = localBrainRuntime.localBrain.provision(humanId);
  results.push({
    name: "one_brain_per_human",
    passed: duplicate.already_exists === true,
    detail: "singleton enforced",
  });

  const identity = localBrainRuntime.localBrain.identityLayer(humanId);
  results.push({
    name: "identity_layer",
    passed: identity.never_duplicates_identity && identity.verified_identity,
    detail: `${identity.organizations.length} orgs`,
  });

  const memory = localBrainRuntime.memory.create({
    human_id: humanId,
    tier: "working",
    category: "mission",
    title: "Current outreach plan",
    content: "Door knocking in District 3",
  });
  results.push({
    name: "memory_created",
    passed: memory.event === "memory.created" && memory.searchable,
    detail: memory.memory.tier,
  });

  const promoted = localBrainRuntime.memory.promote(memory.memory.memory_id, humanId, humanId, "long_term");
  results.push({
    name: "memory_promotion",
    passed: promoted.event === "memory.promoted" && promoted.human_governed,
    detail: promoted.memory.tier,
  });

  const working = localBrainRuntime.workingMemory.update({
    human_id: humanId,
    current_mission_id: "msn-block-street-002",
  });
  results.push({
    name: "working_memory",
    passed: working.continuously_updated && working.working_memory.current_mission_id === "msn-block-street-002",
    detail: working.working_memory.current_mission_id ?? "none",
  });

  const context = localBrainRuntime.context.resolve({
    human_id: humanId,
    institution_id: institutionId,
    mission_id: "msn-block-street-002",
    device: "laptop",
  });
  results.push({
    name: "context_runtime",
    passed: context.event === "context.changed" && context.begins_with_context,
    detail: context.context.institution_id ?? "none",
  });

  const timeline = localBrainRuntime.timeline.add({
    human_id: humanId,
    period: "this_week",
    category: "mission",
    title: "Volunteer recruitment push",
    institution_id: institutionId,
  });
  results.push({
    name: "personal_timeline",
    passed: timeline.event === "timeline.updated" && timeline.explainable,
    detail: timeline.entry.period,
  });

  const graph = localBrainRuntime.knowledgeGraph.add({
    human_id: humanId,
    node_type: "topic",
    label: "Voter outreach",
  });
  results.push({
    name: "personal_knowledge_graph",
    passed: graph.event === "knowledge.cached" && graph.interconnected,
    detail: graph.node.node_type,
  });

  const workspace = localBrainRuntime.workspace.update({
    human_id: humanId,
    pinned_missions: ["msn-block-street-002"],
  });
  results.push({
    name: "workspace_memory",
    passed: workspace.event === "workspace.updated",
    detail: `${workspace.workspace.pinned_missions.length} pinned`,
  });

  const relationship = localBrainRuntime.relationships.learn({
    human_id: humanId,
    contact_human_id: "usr-003",
    relationship_type: "mentor",
  });
  results.push({
    name: "relationship_memory",
    passed: relationship.event === "relationship.learned",
    detail: relationship.relationship.relationship_type,
  });

  const calendar = localBrainRuntime.calendar.update({
    human_id: humanId,
    preparation_buffer_minutes: 20,
  });
  results.push({
    name: "calendar_memory",
    passed: calendar.intelligent_scheduling && calendar.calendar_memory.preparation_buffer_minutes === 20,
    detail: `${calendar.calendar_memory.preparation_buffer_minutes}min buffer`,
  });

  const learning = localBrainRuntime.learning.update({
    human_id: humanId,
    future_goals: ["Advanced leadership track"],
  });
  results.push({
    name: "learning_memory",
    passed: learning.connects_to_learning,
    detail: learning.learning_memory.future_goals[0],
  });

  const privacy = localBrainRuntime.privacy.domains();
  results.push({
    name: "privacy_architecture",
    passed: privacy.default === "private" && privacy.nothing_shared_automatically,
    detail: `${privacy.domains.length} domains`,
  });

  const sync = localBrainRuntime.synchronization.status(humanId);
  results.push({
    name: "synchronization",
    passed: sync.encrypted && sync.offline_capable,
    detail: sync.sync_policy,
  });

  const scratch = localBrainRuntime.temporaryMemory.scratch({
    human_id: humanId,
    title: "Meeting prep notes",
    content: "Key talking points for town hall",
  });
  results.push({
    name: "temporary_memory",
    passed: scratch.memory.tier === "temporary" && !!scratch.memory.expires_at,
    detail: "auto-expiry",
  });

  const longTerm = localBrainRuntime.longTermMemory.recordLesson({
    human_id: humanId,
    title: "Volunteer onboarding lesson",
    content: "Early role clarity improves retention",
  });
  results.push({
    name: "long_term_memory",
    passed: longTerm.memory.tier === "long_term",
    detail: longTerm.memory.category,
  });

  const prefs = localBrainRuntime.preferences.update({
    human_id: humanId,
    language: "en",
    notifications: { daily_brief: true },
  });
  results.push({
    name: "preferences",
    passed: prefs.event === "preferences.changed",
    detail: prefs.preferences.language,
  });

  const analytics = localBrainRuntime.analytics.compute(humanId);
  results.push({
    name: "localbrain_analytics",
    passed: analytics.memory_count >= 1,
    detail: `${analytics.memory_count} memories`,
  });

  const connections = localBrainRuntime.connections.list(humanId);
  results.push({
    name: "institution_connections",
    passed: connections.length >= 1 && connections.every((c) => c.trust_level === "verified"),
    detail: `${connections.length} connections`,
  });

  const trace = explainLocalBrainAction({
    human_id: humanId,
    action_type: "memory_promotion",
    localbrain_id: brain?.localbrain_id,
    memory_id: promoted.memory.memory_id,
  });
  results.push({
    name: "localbrain_traceability",
    passed: trace.includes(humanId) && trace.includes(LIX_LOCALBRAIN_PRINCIPLE),
  });

  results.push({
    name: "localbrain_event_catalog",
    passed: LOCALBRAIN_EVENT_CATALOG.length === 10,
    detail: `${LOCALBRAIN_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allLixW1TestsPassed(): boolean {
  return runLixW1CertificationTests().every((t) => t.passed);
}
