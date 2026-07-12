/**
 * CAE-11.1-W7 — Executive strategy recommendations
 */
import { caeId, nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import { analyzeInstitutionCapacity } from "../intelligence/capacity-intelligence";
import type { OptimizationRecommendation } from "./contracts";

export function generateStrategyRecommendations(institutionId: string): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  const portfolio = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((a) => a && a.initiative.institution_id === institutionId);

  const active = portfolio.filter((a) => a!.initiative.status === "active").length;
  const draft = portfolio.filter((a) => ["concept", "discovery", "design"].includes(a!.initiative.status)).length;
  const overloaded = analyzeInstitutionCapacity(institutionId).filter((c) => c.overload_band === "high");

  if (draft >= 3 && active < 2) {
    recs.push({
      optimization_id: caeId("str"),
      category: "strategy",
      title: "Prioritize draft Initiatives for activation",
      title_es: "Priorizar borradores para activación",
      what_changed: `${draft} drafts vs ${active} active — portfolio skewed toward planning.`,
      why: "Excess drafts without activation dilutes institutional focus.",
      why_es: "Demasiados borradores sin activación diluye el enfoque.",
      confidence: "emerging",
      evidence: [{ signal_id: "draft-active-ratio", source: "portfolio", summary: `${draft} draft / ${active} active` }],
      expected_benefit: "Clearer execution focus and faster community impact.",
      possible_downside: "Deprioritizing drafts may frustrate proposal authors.",
      who_should_review: "Executive leadership",
      suggested_action: "Select top 2 drafts for owner assignment and charter completion this quarter.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  if (overloaded.length > 0) {
    recs.push({
      optimization_id: caeId("str"),
      category: "strategy",
      title: "Recruit additional operational owners",
      title_es: "Reclutar responsables operacionales adicionales",
      what_changed: `Capacity overload on ${overloaded.map((o) => o.human_label).join(", ")}.`,
      why: "Single points of failure threaten Initiative timelines.",
      why_es: "Puntos únicos de falla amenazan los plazos.",
      confidence: "strong_pattern",
      evidence: overloaded.map((o) => ({
        signal_id: o.human_id,
        source: "capacity",
        summary: `${o.active_initiative_count} active Initiatives`,
      })),
      expected_benefit: "Distributed ownership reduces burnout and delays.",
      possible_downside: "More owners increases coordination overhead.",
      who_should_review: "HR and institution leadership",
      suggested_action: "Identify backup owners through governed assignment workflow.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  recs.push({
    optimization_id: "str-statewide-readiness",
    category: "strategy",
    title: "Prepare for statewide expansion",
    title_es: "Preparar expansión estatal",
    what_changed: "County launch workflow shows strong pattern — replication opportunity.",
    why: "Proven workflow can scale with template evolution and training.",
    why_es: "Flujo probado puede escalar con plantillas y capacitación.",
    confidence: "emerging",
    evidence: [{ signal_id: "county-launch", source: "workflow", summary: "County launch sequence validated" }],
    expected_benefit: "Faster launches in adjacent counties.",
    possible_downside: "Statewide scale may strain approval capacity.",
    who_should_review: "Executive strategy council",
    suggested_action: "Run digital twin simulation before committing resources.",
    action_href_optional: "/initiatives/optimization",
    advisory_only: true,
    generated_at: nowIso(),
  });

  return recs;
}
