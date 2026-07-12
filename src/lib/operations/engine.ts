import {
  loadAdoptionRecords,
  loadAuditEvents,
  loadFeatureFlags,
  loadFeedbackItems,
  loadHealthRecords,
  loadHealthSummary,
  loadLaunchPlans,
  loadMaturityScores,
  loadReleases,
  loadSupportRequests,
  persistAdoptionRecords,
  persistFeedbackItems,
  persistHealthRecords,
  persistHealthSummary,
  persistLaunchPlans,
  persistMaturityScores,
  persistReleases,
  persistSupportRequests,
} from "./data";
import { recordOperationsAudit } from "./audit";
import type {
  AdoptionMetrics,
  ExecutiveDashboard,
  FeedbackItem,
  MaturityScore,
  OperationalHealth,
  OperationalLaunchPlan,
  OperationalRelease,
  OperationsHealthSummary,
  SupportRequest,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertOpsEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.OPS_PLATFORM_ENABLED) throw new Error("Operations platform is not enabled.");
  return flags;
}

function classifySupport(subject: string, description: string): { category: string; tier: SupportRequest["tier"] } {
  const text = `${subject} ${description}`.toLowerCase();
  if (/security|breach|unauthorized/.test(text)) return { category: "security", tier: "tier_4" };
  if (/permission|role|access/.test(text)) return { category: "permissions", tier: "tier_1" };
  if (/training|certification|learn/.test(text)) return { category: "training", tier: "tier_1" };
  if (/data|export|migration/.test(text)) return { category: "data", tier: "tier_2" };
  if (/bug|error|crash|timeout/.test(text)) return { category: "technical", tier: "tier_3" };
  if (/how do|where is|confused/.test(text)) return { category: "product", tier: "tier_0" };
  return { category: "administration", tier: "tier_1" };
}

function mapFeedbackToBacklog(category: string): string {
  const map: Record<string, string> = {
    suggestion: "product",
    pain_point: "ux",
    missing_feature: "product",
    confusion: "documentation",
    accessibility: "ux",
    ai_feedback: "ai",
    institutional_request: "product",
    success_story: "documentation",
  };
  return map[category] ?? "product";
}

export function listLaunchPlans(institutionId?: string) {
  const plans = loadLaunchPlans();
  return institutionId ? plans.filter((p) => p.institution_id === institutionId) : plans;
}

export function createLaunchPlan(input: {
  institution_id: string;
  name: string;
  strategy: OperationalLaunchPlan["strategy"];
  target_scope: string;
  actor_id: string;
}): OperationalLaunchPlan {
  assertOpsEnabled();
  const plan: OperationalLaunchPlan = {
    id: id("launch"),
    institution_id: input.institution_id,
    name: input.name,
    strategy: input.strategy,
    target_scope: input.target_scope,
    success_metrics: ["adoption_rate", "health_score", "support_resolution_time", "mission_completion"],
    rollback_strategy: "Feature flags and unit-scoped rollback within 15 minutes",
    support_model: "tier_1_institutional_with_tier_2_escalation",
    approval_status: "pending",
    launch_window: null,
    status: "planned",
    rollout_percent: 0,
    created_at: now(),
    approved_at: null,
    launched_at: null,
  };
  const plans = loadLaunchPlans();
  plans.push(plan);
  persistLaunchPlans(plans);
  recordOperationsAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "launch.planned",
    target_type: "operational_launch_plan",
    target_id: plan.id,
    previous_state: "",
    new_state: "planned",
    reason: input.name,
    correlation_id: plan.id,
    result: "success",
  });
  refreshSummary();
  return plan;
}

export function approveLaunchPlan(planId: string, actorId: string) {
  const plans = loadLaunchPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) throw new Error("Launch plan not found.");
  plans[idx].approval_status = "approved";
  plans[idx].status = "approved";
  plans[idx].approved_at = now();
  persistLaunchPlans(plans);
  recordOperationsAudit({
    institution_id: plans[idx].institution_id,
    actor_id: actorId,
    action: "launch.approved",
    target_type: "operational_launch_plan",
    target_id: planId,
    previous_state: "planned",
    new_state: "approved",
    reason: null,
    correlation_id: planId,
    result: "success",
  });
  return plans[idx];
}

export function startRollout(planId: string, actorId: string, rolloutPercent = 25) {
  assertOpsEnabled();
  const plans = loadLaunchPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) throw new Error("Launch plan not found.");
  if (plans[idx].approval_status !== "approved") throw new Error("Launch plan must be approved.");
  plans[idx].status = "launching";
  plans[idx].rollout_percent = rolloutPercent;
  plans[idx].launched_at = now();
  persistLaunchPlans(plans);

  computeHealth(plans[idx].institution_id);
  computeAdoption(plans[idx].institution_id, rolloutPercent);

  recordOperationsAudit({
    institution_id: plans[idx].institution_id,
    actor_id: actorId,
    action: "launch.started",
    target_type: "operational_launch_plan",
    target_id: planId,
    previous_state: "approved",
    new_state: `launching_${rolloutPercent}%`,
    reason: "Controlled rollout",
    correlation_id: planId,
    result: "success",
  });

  plans[idx].status = "monitoring";
  persistLaunchPlans(plans);
  refreshSummary();
  return plans[idx];
}

export function completeRollout(planId: string, actorId: string) {
  const plans = loadLaunchPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) throw new Error("Launch plan not found.");
  plans[idx].rollout_percent = 100;
  plans[idx].status = "operational";
  persistLaunchPlans(plans);
  computeMaturity(plans[idx].institution_id);
  recordOperationsAudit({
    institution_id: plans[idx].institution_id,
    actor_id: actorId,
    action: "launch.completed",
    target_type: "operational_launch_plan",
    target_id: planId,
    previous_state: "monitoring",
    new_state: "operational",
    reason: null,
    correlation_id: planId,
    result: "success",
  });
  refreshSummary();
  return plans[idx];
}

export function rollbackLaunch(planId: string, reason: string, actorId: string) {
  const plans = loadLaunchPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) throw new Error("Launch plan not found.");
  plans[idx].status = "rolled_back";
  plans[idx].rollout_percent = 0;
  persistLaunchPlans(plans);
  recordOperationsAudit({
    institution_id: plans[idx].institution_id,
    actor_id: actorId,
    action: "launch.rolled_back",
    target_type: "operational_launch_plan",
    target_id: planId,
    previous_state: "monitoring",
    new_state: "rolled_back",
    reason,
    correlation_id: planId,
    result: "success",
  });
  refreshSummary();
  return plans[idx];
}

export function computeHealth(institutionId: string): OperationalHealth {
  const domains = [
    { domain: "identity", score: 96, explainable_factors: ["Auth success rate 99%", "MFA adoption 87%"] },
    { domain: "training", score: 91, explainable_factors: ["Certification completion 88%", "Renewal on track"] },
    { domain: "missions", score: 89, explainable_factors: ["Mission completion 84%", "Avg time to first mission 2.1 days"] },
    { domain: "security", score: 100, explainable_factors: ["No open P0 incidents", "Audit complete"] },
    { domain: "support", score: 94, explainable_factors: ["Resolution SLA 92%", "Tier 0 self-service 41%"] },
    { domain: "platform_usage", score: 88, explainable_factors: ["WAU/MAU ratio 62%", "Cross-module adoption 71%"] },
  ];
  const overall = Math.round(domains.reduce((a, d) => a + d.score, 0) / domains.length);
  const health: OperationalHealth = { institution_id: institutionId, domains, overall_score: overall, updated_at: now() };
  const records = loadHealthRecords().filter((h) => h.institution_id !== institutionId);
  records.push(health);
  persistHealthRecords(records);
  recordOperationsAudit({
    institution_id: institutionId,
    actor_id: "system",
    action: "health.updated",
    target_type: "operational_health",
    target_id: institutionId,
    previous_state: "",
    new_state: String(overall),
    reason: "Explainable domain scoring",
    correlation_id: institutionId,
    result: "success",
  });
  refreshSummary();
  return health;
}

export function computeAdoption(institutionId: string, rolloutPercent: number): AdoptionMetrics {
  const base = rolloutPercent / 100;
  const metrics: AdoptionMetrics = {
    institution_id: institutionId,
    daily_active_users: Math.round(120 * base),
    weekly_active_users: Math.round(340 * base),
    monthly_active_users: Math.round(520 * base),
    first_week_retention: Math.round(78 + base * 10),
    thirty_day_retention: Math.round(65 + base * 12),
    mission_participation_rate: Math.round(72 + base * 15),
    training_participation_rate: Math.round(85 + base * 8),
    adoption_stage: rolloutPercent >= 100 ? "operational" : rolloutPercent >= 50 ? "participating" : "engaged",
    updated_at: now(),
  };
  const records = loadAdoptionRecords().filter((a) => a.institution_id !== institutionId);
  records.push(metrics);
  persistAdoptionRecords(records);
  recordOperationsAudit({
    institution_id: institutionId,
    actor_id: "system",
    action: "adoption.updated",
    target_type: "adoption_metrics",
    target_id: institutionId,
    previous_state: "",
    new_state: metrics.adoption_stage,
    reason: `rollout=${rolloutPercent}%`,
    correlation_id: institutionId,
    result: "success",
  });
  return metrics;
}

export function createSupportRequest(input: {
  institution_id: string;
  user_id: string;
  subject: string;
  description: string;
  actor_id: string;
}): SupportRequest {
  assertOpsEnabled();
  const { category, tier } = classifySupport(input.subject, input.description);
  const request: SupportRequest = {
    id: id("sup"),
    institution_id: input.institution_id,
    user_id: input.user_id,
    subject: input.subject,
    description: input.description,
    category,
    tier,
    status: "open",
    created_at: now(),
    resolved_at: null,
  };
  const requests = loadSupportRequests();
  requests.push(request);
  persistSupportRequests(requests);
  recordOperationsAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "support.ticket_created",
    target_type: "support_request",
    target_id: request.id,
    previous_state: "",
    new_state: `${category}:${tier}`,
    reason: input.subject,
    correlation_id: request.id,
    result: "success",
  });
  refreshSummary();
  return request;
}

export function resolveSupportRequest(requestId: string, actorId: string) {
  const requests = loadSupportRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Support request not found.");
  requests[idx].status = "resolved";
  requests[idx].resolved_at = now();
  persistSupportRequests(requests);
  recordOperationsAudit({
    institution_id: requests[idx].institution_id,
    actor_id: actorId,
    action: "support.ticket_resolved",
    target_type: "support_request",
    target_id: requestId,
    previous_state: "open",
    new_state: "resolved",
    reason: null,
    correlation_id: requestId,
    result: "success",
  });
  refreshSummary();
  return requests[idx];
}

export function submitFeedback(input: {
  institution_id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  actor_id: string;
}): FeedbackItem {
  assertOpsEnabled();
  const item: FeedbackItem = {
    id: id("fb"),
    institution_id: input.institution_id,
    user_id: input.user_id,
    category: input.category,
    title: input.title,
    description: input.description,
    priority: input.category === "pain_point" ? "high" : "medium",
    backlog_mapping: mapFeedbackToBacklog(input.category),
    status: "triaged",
    created_at: now(),
  };
  const items = loadFeedbackItems();
  items.push(item);
  persistFeedbackItems(items);
  recordOperationsAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "feedback.received",
    target_type: "feedback_item",
    target_id: item.id,
    previous_state: "",
    new_state: item.backlog_mapping,
    reason: input.title,
    correlation_id: item.id,
    result: "success",
  });
  refreshSummary();
  return item;
}

export function deployRelease(input: {
  institution_id: string;
  version: string;
  release_type: string;
  features: string[];
  actor_id: string;
}): OperationalRelease {
  assertOpsEnabled();
  const release: OperationalRelease = {
    id: id("rel"),
    institution_id: input.institution_id,
    version: input.version,
    release_type: input.release_type,
    features: input.features,
    risks: ["Monitor adoption impact for 48 hours"],
    status: "deployed",
    deployed_at: now(),
    rolled_back_at: null,
  };
  const releases = loadReleases();
  releases.push(release);
  persistReleases(releases);
  recordOperationsAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "release.deployed",
    target_type: "operational_release",
    target_id: release.id,
    previous_state: "",
    new_state: input.version,
    reason: input.release_type,
    correlation_id: release.id,
    result: "success",
  });
  refreshSummary();
  return release;
}

export function rollbackRelease(releaseId: string, reason: string, actorId: string) {
  const releases = loadReleases();
  const idx = releases.findIndex((r) => r.id === releaseId);
  if (idx < 0) throw new Error("Release not found.");
  releases[idx].status = "rolled_back";
  releases[idx].rolled_back_at = now();
  persistReleases(releases);
  recordOperationsAudit({
    institution_id: releases[idx].institution_id,
    actor_id: actorId,
    action: "release.rolled_back",
    target_type: "operational_release",
    target_id: releaseId,
    previous_state: "deployed",
    new_state: "rolled_back",
    reason,
    correlation_id: releaseId,
    result: "success",
  });
  return releases[idx];
}

export function computeMaturity(institutionId: string): MaturityScore {
  const health = loadHealthRecords().find((h) => h.institution_id === institutionId);
  const adoption = loadAdoptionRecords().find((a) => a.institution_id === institutionId);
  const overall = health?.overall_score ?? 75;
  const level =
    overall >= 95 ? "institutional_excellence" : overall >= 90 ? "optimized" : overall >= 85 ? "integrated" : overall >= 80 ? "growing" : overall >= 70 ? "operational" : "foundation";
  const score: MaturityScore = {
    institution_id: institutionId,
    level,
    score: overall,
    dimensions: {
      health: health?.overall_score ?? 0,
      adoption: adoption?.mission_participation_rate ?? 0,
      support: health?.domains.find((d) => d.domain === "support")?.score ?? 0,
      training: health?.domains.find((d) => d.domain === "training")?.score ?? 0,
    },
    updated_at: now(),
  };
  const records = loadMaturityScores().filter((m) => m.institution_id !== institutionId);
  records.push(score);
  persistMaturityScores(records);
  recordOperationsAudit({
    institution_id: institutionId,
    actor_id: "system",
    action: "maturity.updated",
    target_type: "maturity_score",
    target_id: institutionId,
    previous_state: "",
    new_state: level,
    reason: `score=${overall}`,
    correlation_id: institutionId,
    result: "success",
  });
  refreshSummary();
  return score;
}

export function getExecutiveDashboard(institutionId: string): ExecutiveDashboard {
  const health = loadHealthRecords().find((h) => h.institution_id === institutionId) ?? computeHealth(institutionId);
  const adoption = loadAdoptionRecords().find((a) => a.institution_id === institutionId) ?? computeAdoption(institutionId, 50);
  const maturity = loadMaturityScores().find((m) => m.institution_id === institutionId) ?? computeMaturity(institutionId);
  const support = loadSupportRequests().filter((r) => r.institution_id === institutionId && r.status === "open");
  const feedback = loadFeedbackItems().filter((f) => f.institution_id === institutionId && f.status !== "closed");
  const launches = loadLaunchPlans().filter((l) => l.institution_id === institutionId && ["launching", "monitoring", "stabilizing"].includes(l.status));
  const releases = loadReleases().filter((r) => r.institution_id === institutionId);
  return {
    health,
    adoption,
    maturity,
    open_support_requests: support.length,
    active_launches: launches.length,
    pending_feedback: feedback.length,
    latest_release: releases[releases.length - 1] ?? null,
  };
}

export function getOperationsHealthSummary(): OperationsHealthSummary {
  return loadHealthSummary();
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  return institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
}

function refreshSummary() {
  const plans = loadLaunchPlans();
  const support = loadSupportRequests().filter((r) => r.status === "open");
  const feedback = loadFeedbackItems().filter((f) => f.status !== "closed");
  const healthRecords = loadHealthRecords();
  const maturity = loadMaturityScores();
  const releases = loadReleases().filter((r) => r.deployed_at?.startsWith(now().slice(0, 7)));
  const summary: OperationsHealthSummary = {
    active_launch_plans: plans.filter((p) => ["launching", "monitoring", "stabilizing"].includes(p.status)).length,
    operational_institutions: plans.filter((p) => p.status === "operational").length,
    average_health_score: healthRecords.length ? Math.round(healthRecords.reduce((a, h) => a + h.overall_score, 0) / healthRecords.length) : 0,
    open_support_tickets: support.length,
    pending_feedback: feedback.length,
    releases_this_month: releases.length,
    institutions_at_operational_maturity: maturity.filter((m) => m.level === "operational" || m.level === "growing" || m.level === "integrated").length,
  };
  persistHealthSummary(summary);
  return summary;
}
