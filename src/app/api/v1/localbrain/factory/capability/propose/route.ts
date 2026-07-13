import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        category: string;
        purpose: string;
        dependencies?: string[];
        interfaces?: string[];
        risk_classification?: "low" | "medium" | "high" | "critical";
      };
      return livingIntelligenceApplicationService.proposeCapability({
        institution_id: apiCtx.institution_id,
        owner: apiCtx.human_id,
        name: body.name,
        category: body.category,
        purpose: body.purpose,
        dependencies: body.dependencies,
        interfaces: body.interfaces,
        risk_classification: body.risk_classification,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/factory/capability/propose" }
);
