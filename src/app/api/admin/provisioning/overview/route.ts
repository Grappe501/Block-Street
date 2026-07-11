import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  createRequest,
  getAttentionQueue,
  getProvisioningHealth,
  listInstitutionTypes,
  listRequests,
  listTemplates,
  listAuditEvents,
} from "@/lib/provisioning/engine";
import type { CreateRequestInput } from "@/lib/provisioning/types";

export const GET = withAdmin(() => {
  return NextResponse.json({
    health: getProvisioningHealth(),
    attention_queue: getAttentionQueue(),
    institution_types: listInstitutionTypes(),
    templates: listTemplates(),
    requests: listRequests(),
    audit: listAuditEvents().slice(0, 20),
  });
});

export const POST = withAdmin(async (_ctx, request) => {
  const body = (await request.json()) as CreateRequestInput;
  const record = createRequest(body);
  return NextResponse.json({ request: record }, { status: 201 });
});
