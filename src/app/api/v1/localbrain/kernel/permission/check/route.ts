import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        identity_id: string;
        permission: string;
        permission_type?: "role" | "context" | "mission" | "temporary" | "emergency" | "federated" | "automation";
      };
      return livingIntelligenceApplicationService.checkKernelPermission({
        institution_id: apiCtx.institution_id,
        identity_id: body.identity_id,
        permission: body.permission,
        permission_type: body.permission_type,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/kernel/permission/check" }
);
