/**
 * CAE-11.1-W8 — Operator training modules
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { OperatorTrainingModule } from "./contracts";

const ROOT = process.cwd();

const DEFAULT_MODULES: OperatorTrainingModule[] = [
  {
    module_id: "train-admin",
    role: "administrator",
    title: "Initiative administrator certification",
    duration_minutes: 90,
    topics: ["Governance gates", "Charter validation", "Lifecycle commands", "Audit review"],
    certification_required: true,
  },
  {
    module_id: "train-executive",
    role: "executive",
    title: "Executive onboarding",
    duration_minutes: 45,
    topics: ["Executive brief", "Approval rhythm", "Portfolio intelligence", "Launch sign-off"],
    certification_required: true,
  },
  {
    module_id: "train-owner",
    role: "operational_owner",
    title: "Operational owner onboarding",
    duration_minutes: 60,
    topics: ["Charter workbench", "Readiness center", "Dependencies", "Closeout"],
    certification_required: true,
  },
  {
    module_id: "train-approver",
    role: "approver",
    title: "Approver onboarding",
    duration_minutes: 30,
    topics: ["Approval queue", "Governance matrix", "Rejection reasons", "Batch review"],
    certification_required: true,
  },
  {
    module_id: "train-member",
    role: "member",
    title: "Member onboarding",
    duration_minutes: 20,
    topics: ["Proposing Initiatives", "Portfolio discovery", "Spanish workflows", "Support paths"],
    certification_required: false,
  },
];

export function getOperatorTrainingModules(): OperatorTrainingModule[] {
  const manifestPath = join(ROOT, "data/phase-11/initiative_production_manifest.json");
  if (!existsSync(manifestPath)) return DEFAULT_MODULES;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const modules = manifest.operator_training?.modules;
  return modules?.length ? modules : DEFAULT_MODULES;
}

export function getSupportDocumentation(): { doc_id: string; title: string; path: string }[] {
  const manifestPath = join(ROOT, "data/phase-11/initiative_production_manifest.json");
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return manifest.support_documentation ?? [];
}
