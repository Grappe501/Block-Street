import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { attachEvidence } from "@/lib/civic-outcomes/engine";
import { loadEvidence } from "@/lib/civic-outcomes/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const outcomeId = request.nextUrl.searchParams.get("outcome_record_id");
    let evidence = loadEvidence();
    if (outcomeId) evidence = evidence.filter((e) => e.outcome_record_id === outcomeId);
    return apiSuccess(evidence, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/evidence" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const result = attachEvidence({
      outcome_record_id: body.outcome_record_id,
      evidence_type: body.evidence_type,
      source: body.source,
      verification_level: body.verification_level ?? "leader_verified",
      submitted_by: body.submitted_by ?? ctx.actor_id ?? "system",
      notes: body.notes,
      new_value: body.new_value,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/evidence" }
);
