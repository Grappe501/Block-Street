import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const outputId = request.nextUrl.pathname.split("/")[5] ?? "";
      const body = (await request.json()) as { report: string; context_snapshot?: Record<string, unknown> };
      return livingIntelligenceApplicationService.reportExecutiveOutputProblem({
        human_id: apiCtx.human_id,
        executive_output_id: outputId,
        report: body.report,
        context_snapshot: body.context_snapshot,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/executive-output/{id}/report-problem" }
);
