import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadJuly14Flags, loadJuly14Demo } from "@/lib/july14/config";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      {
        flags: loadJuly14Flags(),
        meeting: loadJuly14Demo().meeting,
        system_status: loadJuly14Demo().system_status,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { public: true, endpoint: "/api/v1/july14/status" }
);
