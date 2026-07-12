import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createOutcomeRecord, listOutcomeRecords } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const programId = request.nextUrl.searchParams.get("program_id") ?? undefined;
    const communityId = request.nextUrl.searchParams.get("community_id") ?? undefined;
    const outcomeType = request.nextUrl.searchParams.get("outcome_type") ?? undefined;
    return apiSuccess(listOutcomeRecords({ institution_id: institutionId, program_id: programId, community_id: communityId, outcome_type: outcomeType }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/outcomes" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const record = createOutcomeRecord({
      institution_id: body.institution_id,
      program_id: body.program_id,
      community_id: body.community_id,
      outcome_type: body.outcome_type,
      category: body.category,
      domain: body.domain,
      indicator: body.indicator,
      baseline: body.baseline,
      target_value: body.target_value,
      measurement_period: body.measurement_period ?? "annual",
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(record, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/outcomes" }
);
