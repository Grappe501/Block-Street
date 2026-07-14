import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        action: string;
        source_subsystem: string;
        permission: string;
      };
      return livingIntelligenceApplicationService.executeKernelRuntime({
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
        action: body.action,
        source_subsystem: body.source_subsystem,
        permission: body.permission,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/kernel/runtime/execute" }
);
