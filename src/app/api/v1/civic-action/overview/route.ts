import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getCaeOverview, runCaeCertification } from "@/lib/civic-action/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getCaeOverview(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/overview" }
);

export const POST = withApiGateway(
  async (ctx) =>
    apiSuccess(runCaeCertification(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/civic-action/overview" }
);
