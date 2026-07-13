/**
 * CAE-11.12-W8 — Operational readiness (backup, DR, audit, monitoring)
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function assessKnowledgeOperationalReadiness(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];
  const manifestPath = join(ROOT, "data/phase-11/knowledge_production_manifest.json");

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
    { key: "recovery_rehearsal", title: "Restore rehearsal documented", category: "recovery" },
  ];

  for (const item of opsItems) {
    const configured = ops[item.key]?.configured === true;
    checks.push({
      check_id: `ops-${item.key}`,
      category: item.category,
      title: item.title,
      status: configured ? "pass" : "attention",
      detail: ops[item.key]?.summary ?? "Document in production manifest",
      blocking: ["backup_procedures", "audit_verification", "health_checks", "recovery_rehearsal"].includes(item.key),
    });
  }

  checks.push({
    check_id: "ops-knowledge-engine",
    category: "monitoring",
    title: "Knowledge engine available",
    status: existsSync(join(ROOT, "src/lib/civic-action/builds/11.12/services/knowledge-engine.ts"))
      ? "pass"
      : "fail",
    detail: "ADP-001 knowledge engine",
    blocking: true,
  });

  return checks;
}

export function knowledgeOperationsReady(): boolean {
  return assessKnowledgeOperationalReadiness().filter((c) => c.blocking).every((c) => c.status === "pass");
}
