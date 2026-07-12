import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { recordDecision, recordInterventionOutcome } from "@/lib/strategic-intelligence/engine";
import { loadDecisions } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    let decisions = loadDecisions();
    if (institutionId) decisions = decisions.filter((d) => d.institution_id === institutionId);
    return apiSuccess(decisions, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/decisions" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    if (body.action === "record_outcome") {
      const result = recordInterventionOutcome({
        institution_id: body.institution_id,
        recommendation_id: body.recommendation_id,
        decision_id: body.decision_id,
        success: body.success ?? true,
        outcome_notes: body.outcome_notes ?? "",
        lessons_learned: body.lessons_learned ?? "",
        actor_id: ctx.actor_id ?? body.actor_id ?? "system",
      });
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const decision = recordDecision({
      institution_id: body.institution_id,
      recommendation_id: body.recommendation_id,
      reviewer_id: body.reviewer_id ?? ctx.actor_id ?? "system",
      decision: body.decision,
      rationale: body.rationale ?? "",
      evidence_reviewed: body.evidence_reviewed ?? [],
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(decision, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.manage", endpoint: "/api/v1/strategic-intelligence/decisions" }
);
