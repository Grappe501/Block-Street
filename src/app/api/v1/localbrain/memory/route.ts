import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => {
      const tier = request.nextUrl.searchParams.get("tier") as
        | Parameters<typeof livingIntelligenceApplicationService.listLocalBrainMemory>[1]
        | null;
      return {
        memories: livingIntelligenceApplicationService.listLocalBrainMemory(apiCtx.human_id, tier ?? undefined),
      };
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/memory" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        tier: string;
        category: string;
        title: string;
        content: string;
        privacy_domain?: string;
      };
      return livingIntelligenceApplicationService.createLocalBrainMemory({
        human_id: apiCtx.human_id,
        tier: body.tier as Parameters<typeof livingIntelligenceApplicationService.createLocalBrainMemory>[0]["tier"],
        category: body.category as Parameters<typeof livingIntelligenceApplicationService.createLocalBrainMemory>[0]["category"],
        title: body.title,
        content: body.content,
        privacy_domain: body.privacy_domain as Parameters<typeof livingIntelligenceApplicationService.createLocalBrainMemory>[0]["privacy_domain"],
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/memory" }
);
