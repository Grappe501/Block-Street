/**
 * CAE-11.6-W14 — Experience tests
 */
import { experienceService } from "./services/experience-service";
import { seedExperienceIfEmpty } from "./services/seed";
import { getExperienceConstitution, OPS_EXPERIENCE_PRINCIPLE, REQUIRED_EXPERIENCE_SERVICES } from "./constitution";
import { checkOpsW14Invariants } from "./invariants";
import { explainExperienceAction } from "./traceability";
import { EXPERIENCE_EVENT_CATALOG } from "./events/catalog";

export type OpsW14TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW14ExperienceTests(): OpsW14TestResult[] {
  seedExperienceIfEmpty();
  const results: OpsW14TestResult[] = [];
  const institutionId = "inst-block-street";
  const humanId = "usr-001";

  const constitution = getExperienceConstitution();
  results.push({ name: "experience_principle", passed: constitution.governing_principle === OPS_EXPERIENCE_PRINCIPLE });

  results.push({
    name: "required_experience_services",
    passed: REQUIRED_EXPERIENCE_SERVICES.length === 15,
    detail: `${REQUIRED_EXPERIENCE_SERVICES.length} services`,
  });

  results.push({ name: "w14_invariants", passed: checkOpsW14Invariants().every((i) => i.passed) });

  const workspaces = experienceService.workspace.list(humanId);
  results.push({
    name: "workspace_registry",
    passed: workspaces.length >= 1,
    detail: `${workspaces.length} workspaces`,
  });

  const opened = experienceService.workspace.open({
    human_id: humanId,
    institution_id: institutionId,
    workspace_type: "volunteer",
    role: "volunteer",
    device: "phone",
  });
  results.push({
    name: "open_workspace",
    passed: opened.event === "workspace.opened" && opened.one_continuous_experience,
    detail: opened.workspace.workspace_type,
  });

  const switched = experienceService.workspace.switch({
    human_id: humanId,
    institution_id: institutionId,
    workspace_type: "executive",
  });
  results.push({
    name: "switch_workspace",
    passed: switched.event === "workspace.switched" || switched.event === "workspace.opened",
    detail: switched.workspace.workspace_type,
  });

  const context = experienceService.context.resolve({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "context_engine",
    passed: context.adapts_automatically && !!context.context,
    detail: context.context.workload_level,
  });

  const nav = experienceService.navigation.primary();
  results.push({
    name: "universal_navigation",
    passed: nav.length >= 12,
    detail: `${nav.length} nav items`,
  });

  const command = experienceService.commandPalette.execute({
    human_id: humanId,
    institution_id: institutionId,
    command: "search_knowledge",
  });
  results.push({
    name: "command_palette",
    passed: command.event === "command.executed",
    detail: command.command,
  });

  const search = experienceService.search.search({
    human_id: humanId,
    institution_id: institutionId,
    query: "outreach",
  });
  results.push({
    name: "universal_search",
    passed: search.event === "search.executed" && search.permissions_respected,
    detail: `${search.results.length} results`,
  });

  const dashboard = experienceService.dashboard.build({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "adaptive_dashboard",
    passed: dashboard.event === "dashboard.updated" && dashboard.cards.length >= 3,
    detail: `${dashboard.cards.length} cards`,
  });

  const notifications = experienceService.notifications.group(humanId);
  results.push({
    name: "smart_notifications",
    passed: notifications.fatigue_minimized && notifications.event === "notification.grouped",
    detail: "grouped",
  });

  const memory = experienceService.memory.update({
    human_id: humanId,
    institution_id: institutionId,
    recent_search: "election dashboard",
  });
  results.push({
    name: "experience_memory",
    passed: memory.belongs_to_human && memory.memory.recent_searches.length >= 1,
    detail: memory.memory.recent_searches[0],
  });

  const personalization = experienceService.personalization.configure({
    institution_id: institutionId,
    brand_name: "Block Street Civic",
    theme: "high_contrast",
  });
  results.push({
    name: "institutional_personalization",
    passed: personalization.navigation_familiar && personalization.event === "experience.personalized",
    detail: personalization.personalization.brand_name,
  });

  const accessibility = experienceService.accessibility.configure({ large_text: true, reduced_motion: true });
  results.push({
    name: "accessibility",
    passed: accessibility.designed_into_every_screen,
    detail: "configured",
  });

  const translation = experienceService.localization.translate({ text: "Home", target_language: "es" });
  results.push({
    name: "localization",
    passed: translation.event === "language.changed" && translation.translated === "Inicio",
    detail: translation.translated,
  });

  const offline = experienceService.offline.activate({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "offline_workspace",
    passed: offline.event === "offline.mode.enabled" && offline.sync_on_resume,
    detail: `${offline.supported.length} capabilities`,
  });

  const analytics = experienceService.analytics.compute(institutionId);
  results.push({
    name: "experience_analytics",
    passed: analytics.improves_interface_not_humans,
    detail: `nav ${analytics.navigation_success_rate}`,
  });

  const adaptive = experienceService.adaptive.adapt({ role: "volunteer", device: "phone", workspace_type: "field" });
  results.push({
    name: "adaptive_interface",
    passed: adaptive.no_functionality_removed_on_mobile,
    detail: adaptive.layout,
  });

  const ai = experienceService.ai.assist({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "ai_experience_assistant",
    passed: ai.advisory_only && ai.explains_sources,
    detail: ai.recommended_actions[0],
  });

  const home = experienceService.unifiedHome({ human_id: humanId, institution_id: institutionId, role: "organizer" });
  results.push({
    name: "unified_home",
    passed: home.one_continuous_experience && home.navigation.length >= 12,
    detail: home.workspace.workspace_type,
  });

  const federation = experienceService.federationExperience(humanId);
  results.push({
    name: "federation_experience",
    passed: federation.switch_without_logout && federation.identity_canonical,
    detail: `${federation.federations.length} federations`,
  });

  const trace = explainExperienceAction({
    human_id: humanId,
    institution_id: institutionId,
    action_type: "open_workspace",
    workspace_id: opened.workspace.workspace_id,
    evidence_refs: ["context-v1"],
  });
  results.push({
    name: "experience_traceability",
    passed: trace.includes(humanId) && trace.includes("Workspace"),
  });

  results.push({
    name: "experience_event_catalog",
    passed: EXPERIENCE_EVENT_CATALOG.length === 10,
    detail: `${EXPERIENCE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW14TestsPassed(): boolean {
  return runOpsW14ExperienceTests().every((t) => t.passed);
}
