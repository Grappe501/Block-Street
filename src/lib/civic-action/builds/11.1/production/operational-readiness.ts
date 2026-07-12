/**
 * CAE-11.1-W8 — Operational readiness (backup, DR, audit, monitoring)
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function assessOperationalReadiness(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];
  const manifestPath = join(ROOT, "data/phase-11/initiative_production_manifest.json");

  if (!existsSync(manifestPath)) {
    return [
      {
        check_id: "ops-manifest",
        category: "operations",
        title: "Operations manifest",
        status: "fail",
        detail: "Missing production manifest",
        blocking: true,
      },
    ];
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const ops = manifest.operations ?? {};

  const opsItems: { key: string; title: string; category: string }[] = [
    { key: "backup_procedures", title: "Backup procedures documented", category: "backup" },
    { key: "disaster_recovery", title: "Disaster recovery plan", category: "disaster_recovery" },
    { key: "audit_verification", title: "Audit trail verification", category: "audit" },
    { key: "monitoring", title: "Monitoring configured", category: "monitoring" },
    { key: "alerting", title: "Alerting rules defined", category: "alerting" },
    { key: "logging", title: "Structured logging", category: "logging" },
    { key: "health_checks", title: "Health check endpoints", category: "health_checks" },
  ];

  for (const item of opsItems) {
    const configured = ops[item.key]?.configured === true;
    checks.push({
      check_id: `ops-${item.key}`,
      category: item.category,
      title: item.title,
      status: configured ? "pass" : "attention",
      detail: ops[item.key]?.summary ?? "Document in production manifest",
      blocking: ["backup_procedures", "audit_verification", "health_checks"].includes(item.key),
    });
  }

  checks.push({
    check_id: "ops-deployment-engine",
    category: "monitoring",
    title: "Deployment engine available",
    status: existsSync(join(ROOT, "src/lib/deployment/engine.ts")) ? "pass" : "fail",
    detail: "DPL-001 deployment platform integration",
    blocking: true,
  });

  return checks;
}

export function operationsReady(): boolean {
  return assessOperationalReadiness().filter((c) => c.blocking).every((c) => c.status === "pass");
}
