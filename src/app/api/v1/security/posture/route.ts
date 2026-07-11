import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getSecurityPosture } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => apiSuccess({ posture: getSecurityPosture() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }),
  { public: true, endpoint: "/api/v1/security/posture" }
);
