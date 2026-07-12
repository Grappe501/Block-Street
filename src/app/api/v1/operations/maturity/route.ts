import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { computeMaturity } from "@/lib/operations/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? "inst-block-street";
    return apiSuccess({ maturity: computeMaturity(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "operations.view", endpoint: "/api/v1/operations/maturity" }
);
