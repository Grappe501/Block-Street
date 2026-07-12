import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { compareScenarios, createScenario } from "@/lib/strategic-intelligence/engine";
import { loadScenarios } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const compare = request.nextUrl.searchParams.get("compare");
    if (compare) {
      const ids = compare.split(",");
      if (!institutionId) throw new Error("institution_id is required");
      return apiSuccess(compareScenarios(institutionId, ids), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    let scenarios = loadScenarios();
    if (institutionId) scenarios = scenarios.filter((s) => s.institution_id === institutionId);
    return apiSuccess(scenarios, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/scenarios" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const scenario = createScenario({
      institution_id: body.institution_id,
      name: body.name,
      assumptions: body.assumptions ?? [],
      inputs: body.inputs ?? {},
      expected_outcomes: body.expected_outcomes ?? [],
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(scenario, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.manage", endpoint: "/api/v1/strategic-intelligence/scenarios" }
);
