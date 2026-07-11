import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listAccessReviews } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => apiSuccess({ reviews: listAccessReviews() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }),
  { permission: "security.view", endpoint: "/api/v1/security/access-reviews" }
);
