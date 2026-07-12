/**
 * CAE-11.1-W4 — Charter workbench assembler
 */
import { initiativeApplicationService } from "../services/application-service";
import { validateCharter } from "../services/charter-validator";
import type { InitiativeExperienceContext } from "./experience-context";
import { t } from "./locale";
import type { CharterSectionView, InitiativeCharterWorkbenchView } from "./view-models";

const SECTION_DEFS = [
  { key: "purpose", labelKey: "charter.purpose", promptKey: "charter.purpose.prompt", field: "purpose" as const },
  { key: "need", labelKey: "charter.need", promptKey: "charter.need.prompt", field: "problem_statement" as const },
  { key: "alignment", labelKey: "charter.alignment", promptKey: "charter.alignment.prompt", field: "institution_alignment" as const },
  { key: "change", labelKey: "charter.change", promptKey: "charter.change.prompt", field: "success_definition" as const },
  { key: "scope_in", labelKey: "charter.scope_in", promptKey: "charter.scope_in.prompt", field: "in_scope" as const },
  { key: "scope_out", labelKey: "charter.scope_out", promptKey: "charter.scope_out.prompt", field: "out_of_scope" as const },
  { key: "timeline", labelKey: "charter.timeline", promptKey: "charter.timeline.prompt", field: "review_frequency" as const },
  { key: "closeout", labelKey: "charter.closeout", promptKey: "charter.closeout.prompt", field: "closeout_basis" as const },
];

function sectionStatus(hasValue: boolean, required: boolean): CharterSectionView["status"] {
  if (!hasValue) return required ? "not_started" : "in_progress";
  return "ready";
}

export function assembleCharterWorkbench(
  initiativeId: string,
  ctx: InitiativeExperienceContext
): InitiativeCharterWorkbenchView | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;

  const charter = agg.charter;
  const review = validateCharter(agg, "review_submission");
  const activation = validateCharter(agg, "activation");

  const sections: CharterSectionView[] = SECTION_DEFS.map((def) => {
    const val = charter?.[def.field];
    const has = typeof val === "string" && val.trim().length > 0;
    return {
      key: def.key,
      label: t(ctx.locale, def.labelKey),
      status: sectionStatus(has, review.missing_fields.includes(def.field)),
      prompt: t(ctx.locale, def.promptKey),
    };
  });

  const readyCount = sections.filter((s) => s.status === "ready").length;

  return {
    initiative_id: initiativeId,
    charter_version: charter?.version ?? null,
    completion_summary: t(ctx.locale, "charter.completion", String(readyCount), String(sections.length)),
    sections,
    readiness: {
      required_before_review: review.missing_fields,
      recommended: review.warnings.map((w) => w.message),
      before_activation: activation.missing_fields,
    },
    next_action: {
      label: t(ctx.locale, "charter.check_readiness"),
      description: t(ctx.locale, "charter.check_readiness.desc"),
      tone: "action",
      href: `/initiatives/${initiativeId}/readiness`,
    },
  };
}
