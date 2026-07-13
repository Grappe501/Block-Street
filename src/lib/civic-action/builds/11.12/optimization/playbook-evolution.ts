/**
 * CAE-11.12-W7 — Playbook and SOP evolution from Mission lessons
 */
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generatePlaybookEvolutionCandidates(institutionId: string): KnowledgeOptimization[] {
  return [
    {
      optimization_id: `pbe-mission-lesson-${institutionId}`,
      category: "playbook_revision",
      title: "Mission debrief playbook improvement candidate",
      what_changed: "Completed Mission may suggest operational lesson.",
      why: "Field practice evidence should inform playbooks without auto-publication.",
      confidence: "medium",
      evidence: [{ signal_id: "mission-closeout", source: "mission", summary: "Lesson candidate" }],
      expected_benefit: "Improved operational repeatability.",
      potential_risk: "SOP changes require stronger authority review.",
      who_should_review: "Mission lead and safety authority for SOPs",
      suggested_action: "Create improvement candidate — not canonical until steward approval.",
      domain_command_required: "CreateKnowledgeArtifact",
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    },
  ];
}

export const SOP_AUTHORITY_REQUIRED = true;
