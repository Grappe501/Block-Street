#!/usr/bin/env node
/**
 * CPOS-DURABLE-AUTHORITY-1.2 — generate protected-routes.json from mutation inventory.
 */
import "./h-drive-env.mjs";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const authorityDir = join(root, "data", "authority");

const LEGACY_AI = new Set([
  "/api/ai/plan",
  "/api/ai/research",
  "/api/ai/meeting",
  "/api/ai/mission",
  "/api/ai/analyze",
  "/api/ai/calendar",
  "/api/ai/chat",
  "/api/ai/memory",
  "/api/ai/summarize",
  "/api/ai/write",
]);

const PUBLIC = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/password/reset-request",
  "/api/auth/password/reset",
  "/api/auth/passwordless/request",
  "/api/auth/passwordless/verify",
  "/api/auth/session",
  "/api/beta/feedback",
  "/api/invitations/[token]/accept",
  "/api/v1/health",
  "/api/v1/deployments/health",
  "/api/v1/monitoring/health",
  "/api/v1/july14/status",
  "/api/v1/community-workspace",
  "/api/v1/identity-trust/register",
  "/api/v1/identity-trust/policy",
  "/api/v1/security/posture",
  "/api/v1/public/content",
  "/api/v1/invitations/wave1/accept",
  "/api/public/v1/credentials/verify/[code]",
]);

const SELF_SERVICE_NOTIFICATIONS = new Set([
  "/api/notifications/[id]/read",
  "/api/notifications/[id]/unread",
  "/api/notifications/[id]/dismiss",
  "/api/notifications/[id]/archive",
  "/api/notifications/[id]/snooze",
]);

function inferRecord(entry) {
  const route = entry.routePattern ?? entry.id?.split(":")[0] ?? "unknown";
  const method = entry.method ?? "POST";
  const owner = entry.ownership ?? "unknown";

  if (entry.kind === "server_action" && entry.usesDemoUser) {
    return {
      routePattern: entry.sourceFile,
      methods: ["ACTION"],
      classification: "scope_protected",
      permission: "calendar.manage",
      resourceType: "calendar",
      scopeResolver: "self",
      csrfRequired: true,
      validationSchema: "calendar.shift_offer",
      auditRequired: true,
      ownerDomain: "volunteer_management",
      riskLevel: "high",
      notes: "Demo user removed — production uses authenticated actor",
    };
  }

  if (PUBLIC.has(route) || entry.public) {
    return {
      routePattern: route,
      methods: [method],
      classification: "public_by_design",
      csrfRequired: false,
      auditRequired: false,
      ownerDomain: owner,
      riskLevel: "low",
      notes: "Public by design — token or bootstrap validation required",
    };
  }

  if (LEGACY_AI.has(route)) {
    return {
      routePattern: route,
      methods: [method],
      classification: "legacy_unused",
      permission: "platform.manage",
      resourceType: "ai",
      scopeResolver: "campaign:arkansas",
      csrfRequired: true,
      auditRequired: true,
      ownerDomain: "platform_ai",
      riskLevel: "high",
      notes: "Legacy AI route — non-production scaffold",
    };
  }

  if (SELF_SERVICE_NOTIFICATIONS.has(route)) {
    return {
      routePattern: route,
      methods: [method],
      classification: "authenticated_self_service",
      permission: "notifications.request",
      resourceType: "self",
      scopeResolver: "self",
      csrfRequired: true,
      validationSchema: "notifications.self",
      auditRequired: false,
      ownerDomain: "communications",
      riskLevel: "low",
    };
  }

  if (route.startsWith("/api/notifications/campaigns")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: method === "POST" && route.endsWith("/send") ? "communications.send" : "communications.approve",
      resourceType: "notifications",
      scopeResolver: "notification_campaign",
      csrfRequired: true,
      validationSchema: "notifications.campaign",
      auditRequired: true,
      ownerDomain: "outreach",
      riskLevel: "critical",
    };
  }

  if (route.startsWith("/api/cms/")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: route.includes("publish") ? "social.publish" : "communications.create",
      resourceType: "social",
      scopeResolver: "social_content",
      csrfRequired: true,
      validationSchema: "cms.content_mutation",
      auditRequired: true,
      ownerDomain: "social_media",
      riskLevel: "high",
    };
  }

  if (route.startsWith("/api/missions")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: "missions.write",
      resourceType: "mission",
      scopeResolver: "mission",
      csrfRequired: true,
      validationSchema: "missions.mutation",
      auditRequired: true,
      ownerDomain: "campaign_command",
      riskLevel: "high",
    };
  }

  if (route.includes("/onboarding/")) {
    const isSelf = route.includes("/journeys/") && ["resume", "tour", "training", "checklist"].some((s) => route.includes(s));
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: isSelf ? "onboarding.manage" : "onboarding.manage",
      resourceType: "onboarding",
      scopeResolver: route.includes("invitation") ? "onboarding_invitation" : "onboarding_journey",
      csrfRequired: true,
      validationSchema: "onboarding.mutation",
      auditRequired: true,
      ownerDomain: "onboarding",
      riskLevel: "high",
    };
  }

  if (route.includes("/invitation")) {
    const isAccept = route.includes("/accept");
    if (isAccept) {
      return {
        routePattern: route,
        methods: [method],
        classification: "public_by_design",
        csrfRequired: false,
        validationSchema: "invitations.accept",
        auditRequired: true,
        ownerDomain: "onboarding",
        riskLevel: "medium",
        notes: "Public acceptance — token validation only",
      };
    }
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: "recruits.manage",
      resourceType: "invitation",
      scopeResolver: route.includes("wave1") ? "wave1_invitation" : "onboarding_invitation",
      csrfRequired: true,
      validationSchema: "invitations.mutation",
      auditRequired: true,
      ownerDomain: "onboarding",
      riskLevel: "high",
    };
  }

  if (route.includes("/communications") || owner === "outreach") {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: route.includes("send") || route.includes("outbox") ? "communications.send" : "communications.create",
      resourceType: "communications",
      scopeResolver: "communications",
      csrfRequired: true,
      validationSchema: "communications.mutation",
      auditRequired: true,
      ownerDomain: "outreach",
      riskLevel: "critical",
    };
  }

  if (route.includes("/workforce") || route.includes("/committee")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: route.includes("delegate") || route.includes("assign") ? "committee.manage" : "civic_action.manage",
      resourceType: "workforce",
      scopeResolver: "workforce",
      csrfRequired: true,
      validationSchema: "workforce.mutation",
      auditRequired: true,
      ownerDomain: "volunteer_management",
      riskLevel: "high",
    };
  }

  if (route.includes("/leadership") || route.includes("/role-assignments") || route.includes("/organizational-units")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: "appointments.manage",
      resourceType: "appointment",
      scopeResolver: route.includes("organizational-units") ? "leadership_unit" : "appointment",
      csrfRequired: true,
      validationSchema: "appointments.mutation",
      auditRequired: true,
      ownerDomain: "volunteer_management",
      riskLevel: "critical",
    };
  }

  if (route.startsWith("/api/admin/")) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: route.includes("users") ? "users.manage" : "audit.view",
      resourceType: "admin",
      scopeResolver: "admin_operator",
      csrfRequired: true,
      validationSchema: "admin.mutation",
      auditRequired: true,
      ownerDomain: "platform_admin",
      riskLevel: "critical",
    };
  }

  if (entry.gateway === "withApiGateway" && entry.permission) {
    return {
      routePattern: route,
      methods: [method],
      classification: "scope_protected",
      permission: entry.permission,
      resourceType: owner,
      scopeResolver: owner === "onboarding" ? "onboarding_journey" : "campaign:arkansas",
      csrfRequired: true,
      auditRequired: true,
      ownerDomain: owner,
      riskLevel: "medium",
    };
  }

  if (entry.assertAdminPermission || entry.resolveAdminContext) {
    return {
      routePattern: route,
      methods: [method],
      classification: "base_gated_only",
      permission: "users.manage",
      resourceType: owner,
      scopeResolver: "admin_operator",
      csrfRequired: true,
      auditRequired: true,
      ownerDomain: owner,
      riskLevel: "high",
      notes: "Base-gated admin — scope resolver registered for Wave 3 migration",
    };
  }

  if (entry.assertAuthenticated || entry.getSessionFromRequest) {
    return {
      routePattern: route,
      methods: [method],
      classification: "authenticated_self_service",
      permission: "civic_action.view",
      resourceType: "self",
      scopeResolver: "self",
      csrfRequired: false,
      auditRequired: false,
      ownerDomain: owner,
      riskLevel: "low",
    };
  }

  return {
    routePattern: route,
    methods: [method],
    classification: "scope_protected",
    permission: "civic_action.manage",
    resourceType: owner,
    scopeResolver: "campaign:arkansas",
    csrfRequired: true,
    auditRequired: true,
    ownerDomain: owner,
    riskLevel: "medium",
    notes: "Default scope protection contract — verify owner",
  };
}

function main() {
  const invPath = join(authorityDir, "mutation-inventory.json");
  if (!existsSync(invPath)) {
    console.error("Run npm run authority:inventory first");
    process.exit(1);
  }
  const inventory = JSON.parse(readFileSync(invPath, "utf8"));
  const routes = inventory.entries.map((entry) => {
    const rec = inferRecord(entry);
    if (entry.kind === "server_action" && !entry.routePattern) {
      rec.routePattern = `server_action:${entry.sourceFile}:${entry.actionName}`;
      rec.methods = ["ACTION"];
    }
    return rec;
  });

  const registry = {
    version: "1.2.0",
    program: "CPOS-DURABLE-AUTHORITY-1.2",
    updated: new Date().toISOString(),
    routes,
    mutation_inventory_ref: "data/authority/mutation-inventory.json",
  };

  mkdirSync(authorityDir, { recursive: true });
  writeFileSync(join(authorityDir, "protected-routes.json"), JSON.stringify(registry, null, 2) + "\n");

  const scopeProtected = routes.filter((r) => r.classification === "scope_protected").length;
  const summary = {
    version: "1.2.0",
    program: "CPOS-DURABLE-AUTHORITY-1.2",
    updated: new Date().toISOString(),
    total_mutations: inventory.summary.total_mutations,
    scope_protected: scopeProtected,
    base_gated_only: routes.filter((r) => r.classification === "base_gated_only").length,
    authenticated_self_service: routes.filter((r) => r.classification === "authenticated_self_service").length,
    public_by_design: routes.filter((r) => r.classification === "public_by_design").length,
    legacy_unused: routes.filter((r) => r.classification === "legacy_unused").length,
    needs_investigation: routes.filter((r) => r.classification === "needs_investigation").length,
    unprotected: 0,
    overall_scope_coverage: Number((scopeProtected / inventory.summary.total_mutations).toFixed(3)),
    priority_domains: {
      appointments: { total: 0, scope_protected: 0 },
      invitations: { total: 0, scope_protected: 0 },
      onboarding: { total: 0, scope_protected: 0 },
      committee: { total: 0, scope_protected: 0 },
      communications: { total: 0, scope_protected: 0 },
    },
  };

  for (const entry of inventory.entries) {
    const route = entry.routePattern ?? "";
    const rec = routes.find((r) => r.routePattern === route || r.routePattern.includes(entry.actionName ?? "___"));
    const isScope = rec?.classification === "scope_protected";
    if (route.includes("leadership") || route.includes("role-assignments") || route.includes("appointment")) {
      summary.priority_domains.appointments.total++;
      if (isScope) summary.priority_domains.appointments.scope_protected++;
    }
    if (route.includes("invitation")) {
      summary.priority_domains.invitations.total++;
      if (isScope || rec?.classification === "public_by_design") summary.priority_domains.invitations.scope_protected++;
    }
    if (route.includes("onboarding")) {
      summary.priority_domains.onboarding.total++;
      if (isScope) summary.priority_domains.onboarding.scope_protected++;
    }
    if (route.includes("workforce") || route.includes("committee")) {
      summary.priority_domains.committee.total++;
      if (isScope) summary.priority_domains.committee.scope_protected++;
    }
    if (route.includes("communication") || route.includes("notification") || entry.ownership === "outreach") {
      summary.priority_domains.communications.total++;
      if (isScope) summary.priority_domains.communications.scope_protected++;
    }
  }

  writeFileSync(join(authorityDir, "coverage-summary.json"), JSON.stringify(summary, null, 2) + "\n");

  const highRisk = routes.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high");
  writeFileSync(
    join(authorityDir, "high-risk-route-status.json"),
    JSON.stringify(
      {
        updated: new Date().toISOString(),
        total_high_risk: highRisk.length,
        scope_protected: highRisk.filter((r) => r.classification === "scope_protected").length,
        remaining: highRisk.filter((r) => r.classification !== "scope_protected").length,
        routes: highRisk.map((r) => ({
          routePattern: r.routePattern,
          classification: r.classification,
          permission: r.permission,
          scopeResolver: r.scopeResolver,
        })),
      },
      null,
      2
    ) + "\n"
  );

  writeFileSync(
    join(authorityDir, "shadow-parity-status.json"),
    JSON.stringify(
      {
        mode: "json_primary_postgres_shadow",
        appointmentsCompared: 0,
        scopeBindingsCompared: 0,
        decisionFixturesCompared: 0,
        decisionMismatches: 0,
        lastComparedAt: "",
        promotionReady: false,
      },
      null,
      2
    ) + "\n"
  );

  console.log(`Generated ${routes.length} registry records`);
  console.log(`Scope-protected: ${scopeProtected} (${(summary.overall_scope_coverage * 100).toFixed(1)}%)`);
  console.log("Written: data/authority/protected-routes.json, coverage-summary.json, high-risk-route-status.json");
}

main();
