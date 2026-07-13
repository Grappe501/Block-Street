/**
 * CAE-11.6-W5 — Resource tests
 */
import { resourceService } from "./services/resource-service";
import { seedResourcesIfEmpty } from "./services/seed";
import { getResourceConstitution, OPS_RESOURCE_PRINCIPLE, REQUIRED_RESOURCE_SERVICES } from "./constitution";
import { checkOpsW5Invariants } from "./invariants";
import { explainResourceMissionAlignment } from "./traceability";
import { RESOURCE_EVENT_CATALOG } from "./events/catalog";

export type OpsW5TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW5ResourceTests(): OpsW5TestResult[] {
  seedResourcesIfEmpty();
  const results: OpsW5TestResult[] = [];
  const institutionId = "inst-block-street";

  const constitution = getResourceConstitution();
  results.push({
    name: "resource_principle",
    passed: constitution.governing_principle === OPS_RESOURCE_PRINCIPLE,
  });

  results.push({
    name: "required_resource_services",
    passed: REQUIRED_RESOURCE_SERVICES.length === 15,
    detail: `${REQUIRED_RESOURCE_SERVICES.length} services`,
  });

  results.push({
    name: "w5_invariants",
    passed: checkOpsW5Invariants().every((i) => i.passed),
  });

  const assets = resourceService.assets.list(institutionId);
  results.push({
    name: "seeded_assets",
    passed: assets.length >= 2,
    detail: `${assets.length} assets`,
  });

  const missionAssets = assets.filter((a) => a.mission_id === "opm-volunteer-training-001");
  results.push({
    name: "mission_resource_assignment",
    passed: missionAssets.length >= 2,
    detail: `${missionAssets.length} mission-linked`,
  });

  const facilities = resourceService.facilities.list(institutionId);
  results.push({
    name: "facilities_engine",
    passed: facilities.length >= 1,
    detail: facilities[0]?.name,
  });

  const spaces = resourceService.spaces.list(institutionId);
  results.push({
    name: "space_management",
    passed: spaces.length >= 1 && spaces[0].capacity > 0,
    detail: `${spaces.length} spaces`,
  });

  const budgets = resourceService.budgets.list(institutionId);
  results.push({
    name: "budget_model",
    passed: budgets.length >= 1 && budgets[0].remaining >= 0,
    detail: `remaining=${budgets[0]?.remaining}`,
  });

  const inventory = resourceService.inventory.list(institutionId);
  results.push({
    name: "inventory_engine",
    passed: inventory.length >= 1,
    detail: `${inventory.length} items`,
  });

  const maintenance = resourceService.maintenance.list(institutionId);
  results.push({
    name: "maintenance_engine",
    passed: maintenance.length >= 1,
    detail: maintenance[0]?.status,
  });

  const health = resourceService.health.compute(assets[0].resource_id);
  results.push({
    name: "resource_health",
    passed: health.condition_score >= 0 && health.mission_criticality >= 0,
    detail: `condition=${health.condition_score}`,
  });

  const trace = explainResourceMissionAlignment({
    resource_id: assets[0].resource_id,
    institution_id: institutionId,
    mission_id: assets[0].mission_id,
    category: assets[0].category,
  });
  results.push({
    name: "resource_traceability",
    passed: trace.includes("Mission") && trace.includes("Institution"),
    detail: trace.slice(0, 60),
  });

  const ai = resourceService.ai.analyze(institutionId);
  results.push({
    name: "ai_resource_advisory",
    passed: ai.advisory_only === true && ai.may_not_purchase_autonomously === true,
  });

  const dashboard = resourceService.executiveDashboard.build(institutionId);
  results.push({
    name: "executive_resource_dashboard",
    passed: dashboard.advisory_only === true && dashboard.budget_health.length >= 1,
    detail: `${dashboard.asset_health.length} asset health records`,
  });

  results.push({
    name: "resource_event_catalog",
    passed: RESOURCE_EVENT_CATALOG.length >= 11,
    detail: `${RESOURCE_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW5TestsPassed(): boolean {
  return runOpsW5ResourceTests().every((t) => t.passed);
}
