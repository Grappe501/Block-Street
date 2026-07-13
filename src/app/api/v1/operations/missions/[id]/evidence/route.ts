import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { operationalMissionIdFromPath, withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, async (apiCtx) => {
      const id = operationalMissionIdFromPath(request);
      const body = (await request.json()) as {
        evidence_type: "photo" | "document" | "note" | "checklist";
        title: string;
        uri_or_reference: string;
      };
      return operationsApplicationService.recordMissionEvidence({
        mission_id: id,
        evidence_type: body.evidence_type,
        title: body.title,
        uri_or_reference: body.uri_or_reference,
        recorded_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/operations/missions/[id]/evidence" }
);
