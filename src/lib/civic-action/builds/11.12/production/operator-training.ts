/**
 * CAE-11.12-W8 — Operator training modules
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { OperatorTrainingModule } from "./contracts";

const ROOT = process.cwd();

const DEFAULT_MODULES: OperatorTrainingModule[] = [
  {
    module_id: "train-steward",
    role: "knowledge_steward",
    title: "Knowledge steward certification",
    duration_minutes: 120,
    topics: ["Artifact review", "Citation repair", "Version awareness", "Translation maintenance"],
    certification_required: true,
  },
  {
    module_id: "train-instructor",
    role: "instructor",
    title: "Instructor readiness",
    duration_minutes: 90,
    topics: ["Course management", "Learner support", "Tutor escalation", "Assessment interpretation"],
    certification_required: true,
  },
  {
    module_id: "train-certifier",
    role: "certifier",
    title: "Certifier readiness",
    duration_minutes: 60,
    topics: ["Eligibility review", "Evidence requirements", "Appeal handling", "Public verification"],
    certification_required: true,
  },
  {
    module_id: "train-executive",
    role: "executive",
    title: "Executive onboarding",
    duration_minutes: 45,
    topics: ["Launch scope", "AI boundaries", "Rollback conditions", "Residual risks"],
    certification_required: true,
  },
  {
    module_id: "train-admin",
    role: "administrator",
    title: "Platform administrator",
    duration_minutes: 90,
    topics: ["Certification runs", "Recovery drills", "Event replay", "Launch control"],
    certification_required: true,
  },
  {
    module_id: "train-learner",
    role: "learner",
    title: "Learner onboarding",
    duration_minutes: 30,
    topics: ["Learning path", "AI tutor", "Competency evidence", "Spanish workflows"],
    certification_required: false,
  },
];

export function getKnowledgeOperatorTrainingModules(): OperatorTrainingModule[] {
  const manifestPath = join(ROOT, "data/phase-11/knowledge_production_manifest.json");
  if (!existsSync(manifestPath)) return DEFAULT_MODULES;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const modules = manifest.operator_training?.modules;
  return modules?.length ? modules : DEFAULT_MODULES;
}

export function getKnowledgeSupportDocumentation(): { doc_id: string; title: string; path: string }[] {
  const manifestPath = join(ROOT, "data/phase-11/knowledge_production_manifest.json");
  if (!existsSync(manifestPath)) return [];
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return manifest.support_documentation ?? [];
}
