import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { recordProgramOutput } from "@/lib/civic-outcomes/engine";
import { loadOutputs } from "@/lib/civic-outcomes/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const programId = request.nextUrl.searchParams.get("program_id");
    let outputs = loadOutputs();
    if (programId) outputs = outputs.filter((o) => o.program_id === programId);
    return apiSuccess(outputs, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/outputs" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const output = recordProgramOutput({
      program_id: body.program_id,
      institution_id: body.institution_id,
      output_type: body.output_type,
      description: body.description,
      quantity: body.quantity ?? 1,
      period: body.period ?? "annual",
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(output, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/outputs" }
);
