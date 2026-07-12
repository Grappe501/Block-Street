import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { searchAuditEvents, getAuditLineage, runIntegrityCheck, createAuditExport } from "@/lib/identity-trust/wave6/audit";

export const GET = withApiGateway(
  async (ctx, request) => {
    const humanId = request.nextUrl.searchParams.get("human_id");
    const correlationId = request.nextUrl.searchParams.get("correlation_id");
    const mode = request.nextUrl.searchParams.get("mode") ?? "events";

    if (mode === "lineage" && humanId) {
      return apiSuccess(getAuditLineage(humanId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "correlation" && correlationId) {
      return apiSuccess(searchAuditEvents({ correlation_id: correlationId }), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    return apiSuccess(
      searchAuditEvents({
        human_id: humanId ?? undefined,
        institution_id: request.nextUrl.searchParams.get("institution_id") ?? undefined,
        event_type: request.nextUrl.searchParams.get("event_type") ?? undefined,
        limit: Number(request.nextUrl.searchParams.get("limit") ?? "100"),
      }),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-audit/events" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;

    if (action === "integrity_check") {
      return apiSuccess(runIntegrityCheck(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (action === "export") {
      return apiSuccess(
        createAuditExport({
          requester_id: ctx.actor_id!,
          purpose: body.purpose as string,
          scope: (body.scope as string[]) ?? [],
          institution_id: body.institution_id as string | undefined,
        }),
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
      );
    }
    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-audit/events" }
);
