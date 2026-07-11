import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getReleaseById } from "@/lib/deployment/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/").pop() ?? "";
    const release = getReleaseById(id);
    return apiSuccess(release, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "deployments.view", endpoint: "/api/v1/deployments/{id}" }
);
