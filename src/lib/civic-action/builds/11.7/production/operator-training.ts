/**
 * CAE-11.7-W8 — Operator training modules
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { OperatorTrainingModule } from "./contracts";

const ROOT = process.cwd();

const DEFAULT_MODULES: OperatorTrainingModule[] = [
  {
    module_id: "train-admin",
    role: "administrator",
    title: "Communication administrator certification",
    duration_minutes: 90,
    topics: ["Communications engine", "Lifecycle commands", "Governance gates", "Audit review"],
    certification_required: true,
  },
  {
    module_id: "train-executive",
    role: "executive",
    title: "Executive onboarding",
    duration_minutes: 45,
    topics: ["Executive brief", "Decision intelligence", "Communication health", "Launch sign-off"],
    certification_required: true,
  },
  {
    module_id: "train-owner",
    role: "operational_owner",
    title: "Operational owner onboarding",
    duration_minutes: 60,
    topics: ["Collaboration workbench", "Daily brief", "Meeting workspace", "Knowledge capture"],
    certification_required: true,
  },
  {
    module_id: "train-mission-lead",
    role: "mission_lead",
    title: "Mission lead onboarding",
    duration_minutes: 45,
    topics: ["Mission conversations", "Thread resolution", "Action items", "Meeting notes"],
    certification_required: true,
  },
  {
    module_id: "train-contributor",
    role: "contributor",
    title: "Contributor onboarding",
    duration_minutes: 30,
    topics: ["Mentions", "Assigned actions", "Document collaboration", "Spanish workflows"],
    certification_required: true,
  },
  {
    module_id: "train-volunteer",
    role: "volunteer",
    title: "Volunteer onboarding",
    duration_minutes: 20,
    topics: ["Today's messages", "Announcements", "Simple actions", "Support paths"],
    certification_required: false,
  },
];

export function getCommunicationOperatorTrainingModules(): OperatorTrainingModule[] {
  const manifestPath = join(ROOT, "data/phase-11/communication_production_manifest.json");
  if (!existsSync(manifestPath)) return DEFAULT_MODULES;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const modules = manifest.operator_training?.modules;
  return modules?.length ? modules : DEFAULT_MODULES;
}

export function getCommunicationSupportDocumentation(): { doc_id: string; title: string; path: string }[] {
  const manifestPath = join(ROOT, "data/phase-11/communication_production_manifest.json");
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return manifest.support_documentation ?? [];
}
