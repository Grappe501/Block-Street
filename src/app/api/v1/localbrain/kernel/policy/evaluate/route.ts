import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { policy_id: string; action: string };
      return livingIntelligenceApplicationService.evaluateKernelPolicy({
        institution_id: apiCtx.institution_id,
        policy_id: body.policy_id,
        action: body.action,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/kernel/policy/evaluate" }
);
