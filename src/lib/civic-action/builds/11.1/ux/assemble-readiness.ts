/**
 * CAE-11.1-W4 — Readiness center assembler
 */
import { initiativeApplicationService } from "../services/application-service";
import { validateCharter } from "../services/charter-validator";
import { evaluateDependencyReadiness } from "../services/dependency-graph";
import { checkOwnerEligibility } from "../services/owner-eligibility";
import type { InitiativeExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { t } from "./locale";
import type { InitiativeReadinessView, ReadinessAreaView } from "./view-models";

export function assembleInitiativeReadiness(
  initiativeId: string,
  ctx: InitiativeExperienceContext
): InitiativeReadinessView | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;

  const ini = agg.initiative;
  const charter = validateCharter(agg, "activation");
  const deps = evaluateDependencyReadiness(initiativeId, agg.dependencies);
  const opOwner = checkOwnerEligibility(
    ini.operational_owner_human_id,
    ini.institution_id,
    initiativeId,
    "operational_owner"
  );
  const execOwner = ini.executive_owner_human_id
    ? checkOwnerEligibility(ini.executive_owner_human_id, ini.institution_id, initiativeId, "executive_owner")
    : { eligible: false, reason_codes: ["missing"] };

  const ownershipDetails: string[] = [
    `${t(ctx.locale, "owner.operational")}: ${humanLabel(ini.operational_owner_human_id)} — ${opOwner.eligible ? "Accepted" : "Needs attention"}`,
    `${t(ctx.locale, "owner.executive")}: ${humanLabel(ini.executive_owner_human_id)} — ${execOwner.eligible ? "Accepted" : "Needs attention"}`,
  ];
  if (!ini.backup_owner_human_id) {
    ownershipDetails.push(t(ctx.locale, "readiness.backup_missing"));
  }

  const must_complete: ReadinessAreaView[] = [];
  if (!charter.is_valid) {
    must_complete.push({
      key: "charter",
      label: t(ctx.locale, "readiness.area.charter"),
      status: "blocked",
      details: charter.missing_fields.map((f) => `Missing: ${f}`),
      action_label: t(ctx.locale, "readiness.open_charter"),
      action_href: `/initiatives/${initiativeId}/charter`,
    });
  }
  if (!opOwner.eligible) {
    must_complete.push({
      key: "ownership",
      label: t(ctx.locale, "readiness.area.ownership"),
      status: "blocked",
      details: ownershipDetails,
      action_label: t(ctx.locale, "readiness.assign_owner"),
      action_href: `/initiatives/${initiativeId}/people`,
    });
  }
  if (!deps.ready) {
    must_complete.push({
      key: "dependencies",
      label: t(ctx.locale, "readiness.area.dependencies"),
      status: "blocked",
      details: deps.blocking_dependencies.map((b) => b.description || b.target_id),
      action_label: t(ctx.locale, "readiness.open_dependencies"),
      action_href: `/initiatives/${initiativeId}/dependencies`,
    });
  }

  const recommended: ReadinessAreaView[] = [];
  if (!execOwner.eligible) {
    recommended.push({
      key: "executive",
      label: t(ctx.locale, "readiness.area.executive"),
      status: "needs_attention",
      details: [t(ctx.locale, "readiness.executive_recommended")],
      action_href: `/initiatives/${initiativeId}/people`,
    });
  }

  const ready = must_complete.length === 0 && opOwner.eligible && charter.is_valid && deps.ready;
  const completeCount = 9 - must_complete.length;

  return {
    initiative_id: initiativeId,
    header: ready ? t(ctx.locale, "readiness.header.ready") : t(ctx.locale, "readiness.header.not_ready"),
    summary: t(ctx.locale, "readiness.summary", String(Math.max(0, completeCount)), "9"),
    ready_to_activate: ready,
    must_complete,
    recommended,
    after_activation: [
      {
        key: "objectives",
        label: t(ctx.locale, "readiness.after.objectives"),
        status: "needs_attention",
        details: [t(ctx.locale, "readiness.after.objectives.detail")],
      },
    ],
    activation_preview: ready
      ? t(ctx.locale, "readiness.activation_preview")
      : null,
  };
}
