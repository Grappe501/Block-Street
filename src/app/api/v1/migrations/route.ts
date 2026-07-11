import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createMigrationProject, listProjects } from "@/lib/migration/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ projects: listProjects(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "migration.view", endpoint: "/api/v1/migrations" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      name: string;
      description?: string;
      migration_type: string;
      target_domains: string[];
      migration_owner_user_id: string;
      data_owner_user_id: string;
      security_reviewer_user_id: string;
      institution_approver_user_id: string;
      risk_level?: "M1" | "M2" | "M3" | "M4";
    };
    try {
      const project = createMigrationProject(body, ctx.actor_id ?? "system");
      return apiSuccess({ project }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Failed to create migration project", 400);
    }
  },
  { permission: "migration.manage", endpoint: "/api/v1/migrations" }
);
