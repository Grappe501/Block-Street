import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getAdminIdentityOverview } from "@/lib/july14/home";
import { loadJuly14Demo } from "@/lib/july14/config";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      {
        overview: getAdminIdentityOverview(),
        audit_lineage_demo: loadJuly14Demo().audit_lineage_demo,
        system_status: loadJuly14Demo().system_status,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "identity_trust.manage", endpoint: "/api/v1/july14/admin-overview" }
);
