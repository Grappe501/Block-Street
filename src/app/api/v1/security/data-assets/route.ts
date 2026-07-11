import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listDataAssets } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => apiSuccess(listDataAssets(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id }),
  { permission: "security.view", endpoint: "/api/v1/security/data-assets" }
);
