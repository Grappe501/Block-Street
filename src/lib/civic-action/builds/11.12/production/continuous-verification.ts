/**
 * CAE-11.12-W8 — Continuous verification schedules
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { nowIso } from "../../../utils";
import type { VerificationSchedule } from "./contracts";
import { getCertificationStatus } from "./certification-run";
import { criticalGatesPassed } from "./certification-registry";

const ROOT = process.cwd();

const DEFAULT_SCHEDULES: VerificationSchedule[] = [
  {
    schedule_id: "verify-daily",
    cadence: "daily",
    title: "Daily health checks",
    owner_role: "operations",
    checks: ["API health", "Knowledge store integrity", "Event outbox depth", "AI grounding failures", "Credential verification"],
  },
  {
    schedule_id: "verify-weekly",
    cadence: "weekly",
    title: "Weekly governance audit",
    owner_role: "knowledge_steward",
    checks: ["Authorization review", "Translation staleness", "Assessment integrity", "Support review"],
  },
  {
    schedule_id: "verify-monthly",
    cadence: "monthly",
    title: "Monthly restore sample",
    owner_role: "platform_administrator",
    checks: ["Restore sample", "Permission audit", "Certification expiration audit", "Accessibility review"],
  },
  {
    schedule_id: "verify-quarterly",
    cadence: "quarterly",
    title: "Quarterly constitutional review",
    owner_role: "institution_leadership",
    checks: ["Constitution compliance", "AI recertification", "Institution isolation test", "Full recovery drill"],
  },
  {
    schedule_id: "verify-annual",
    cadence: "annual",
    title: "Annual institutional assessment",
    owner_role: "executive_council",
    checks: ["Learning outcomes", "Institutional memory quality", "Operator certification renewal", "Maturity review"],
  },
];

export function getKnowledgeVerificationSchedules(): VerificationSchedule[] {
  const manifestPath = join(ROOT, "data/phase-11/knowledge_production_manifest.json");
  if (!existsSync(manifestPath)) return DEFAULT_SCHEDULES;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const schedules = manifest.continuous_verification?.schedules;
  return schedules?.length ? schedules : DEFAULT_SCHEDULES;
}

export function runContinuousVerification() {
  const status = getCertificationStatus();
  return {
    run_id: `verify-${Date.now()}`,
    started_at: nowIso(),
    critical_gates_passed: criticalGatesPassed(),
    certification_status: status,
    schedules: getKnowledgeVerificationSchedules(),
    completed_at: nowIso(),
  };
}
