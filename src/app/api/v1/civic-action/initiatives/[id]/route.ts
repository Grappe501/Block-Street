import { withApiGateway } from "@/lib/api/http";
import { apiSuccess, ApiError } from "@/lib/api/errors";
import {
  assembleInitiativeOverview,
  assembleCharterWorkbench,
  assembleInitiativeReadiness,
  assembleWorkspaceShell,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";

export const GET = withApiGateway(
  async (ctx, request) => {
    const parts = request.nextUrl.pathname.split("/");
    const id = parts[parts.indexOf("initiatives") + 1];
    if (!id) throw new ApiError("VALIDATION_ERROR", "initiative id required", 400);

    const view = request.nextUrl.searchParams.get("view") ?? "overview";
    const locale = request.nextUrl.searchParams.get("locale") === "es" ? "es" as const : "en" as const;
    const context = { ...DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT, locale };

    let data: unknown;
    switch (view) {
      case "shell":
        data = assembleWorkspaceShell(id, context);
        break;
      case "charter":
        data = assembleCharterWorkbench(id, context);
        break;
      case "readiness":
        data = assembleInitiativeReadiness(id, context);
        break;
      default:
        data = assembleInitiativeOverview(id, context);
    }

    if (!data) throw new ApiError("NOT_FOUND", "Initiative not found", 404);
    return apiSuccess(data, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/initiatives/[id]" }
);
