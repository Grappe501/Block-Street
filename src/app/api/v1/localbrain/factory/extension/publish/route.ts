import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        category: "capability" | "module" | "agent" | "workflow" | "playbook" | "theme" | "learning" | "research" | "integration";
        validated?: boolean;
      };
      return livingIntelligenceApplicationService.publishExtension({
        institution_id: apiCtx.institution_id,
        publisher: apiCtx.human_id,
        name: body.name,
        category: body.category,
        validated: body.validated,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/factory/extension/publish" }
);
