import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  listWorkItems,
  getWorkItem,
  assignWorkItem,
  acknowledgeWorkItem,
  escalateWorkItem,
  completeWorkItem,
} from "@/lib/identity-trust/wave6/queue";

export const GET = withApiGateway(
  async (ctx, request) => {
    const workItemId = request.nextUrl.searchParams.get("work_item_id");
    if (workItemId) {
      const item = getWorkItem(workItemId);
      if (!item) throw new Error("Work item not found");
      return apiSuccess(item, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const assignedTo = request.nextUrl.searchParams.get("assigned_to") ?? ctx.actor_id!;
    const statusParam = request.nextUrl.searchParams.get("status");
    const overdue = request.nextUrl.searchParams.get("overdue") === "true";
    return apiSuccess(
      listWorkItems({
        assigned_to: assignedTo,
        status: statusParam ? (statusParam as import("@/lib/identity-trust/wave6/types").WorkItemStatus) : undefined,
        overdue: overdue || undefined,
      }),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-ops/work-items" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    const workItemId = body.work_item_id as string;

    if (action === "assign") {
      return apiSuccess(assignWorkItem(workItemId, body.assignee_id as string, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "acknowledge") {
      return apiSuccess(acknowledgeWorkItem(workItemId, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "escalate") {
      return apiSuccess(escalateWorkItem(workItemId, ctx.actor_id!, (body.reason as string) ?? "Escalated"), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "complete") {
      return apiSuccess(completeWorkItem(workItemId, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-ops/work-items" }
);
