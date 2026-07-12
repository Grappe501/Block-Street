/**
 * CAE-11.2-W8 — Continuous verification schedules
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { VerificationSchedule } from "./contracts";

const ROOT = process.cwd();

const DEFAULT_SCHEDULES: VerificationSchedule[] = [
  {
    schedule_id: "verify-daily",
    cadence: "daily",
    title: "Daily health checks",
    owner_role: "operations",
    checks: ["API health", "Execution store integrity", "Event outbox depth", "Failed webhooks"],
  },
  {
    schedule_id: "verify-weekly",
    cadence: "weekly",
    title: "Weekly governance audit",
    owner_role: "governance_administrator",
    checks: ["Lifecycle violations", "Orphan work detection", "Permission anomalies", "Overdue reviews"],
  },
  {
    schedule_id: "verify-monthly",
    cadence: "monthly",
    title: "Monthly optimization review",
    owner_role: "executive",
    checks: ["Optimization acceptance rate", "Lessons captured", "Template evolution", "Org health trends"],
  },
  {
    schedule_id: "verify-quarterly",
    cadence: "quarterly",
    title: "Quarterly constitutional review",
    owner_role: "institution_leadership",
    checks: ["Constitution compliance", "AI boundary audit", "Cross-wave regression", "Requirements traceability"],
  },
  {
    schedule_id: "verify-annual",
    cadence: "annual",
    title: "Annual institutional assessment",
    owner_role: "executive_council",
    checks: ["Objective outcomes", "Institutional memory quality", "Statewide readiness", "Operator certification renewal"],
  },
];

export function getObjectiveVerificationSchedules(): VerificationSchedule[] {
  const manifestPath = join(ROOT, "data/phase-11/objective_production_manifest.json");
  if (!existsSync(manifestPath)) return DEFAULT_SCHEDULES;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const schedules = manifest.continuous_verification?.schedules;
  return schedules?.length ? schedules : DEFAULT_SCHEDULES;
}
