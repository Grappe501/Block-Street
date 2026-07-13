/**
 * CAE-11.7-W8 — Operational readiness (backup, DR, audit, monitoring)
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function assessCommunicationOperationalReadiness(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];
  const manifestPath = join(ROOT, "data/phase-11/communication_production_manifest.json");

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
    check_id: "ops-communications-engine",
    category: "monitoring",
    title: "Communications engine available",
    status: existsSync(join(ROOT, "src/lib/civic-action/builds/11.7/services/communications-engine.ts"))
      ? "pass"
      : "fail",
    detail: "COM-SVC-001 communications engine",
    blocking: true,
  });

  return checks;
}

export function communicationOperationsReady(): boolean {
  return assessCommunicationOperationalReadiness().filter((c) => c.blocking).every((c) => c.status === "pass");
}
