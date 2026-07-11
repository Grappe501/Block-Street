import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getLaunchOverview, listProvisionings, createProvisioning, listConfigurationTemplates } from "@/lib/launch/engine";
import type { CreateProvisioningInput } from "@/lib/launch/types";

export const GET = withAdmin(() => {
  return NextResponse.json({
    overview: getLaunchOverview(),
    provisionings: listProvisionings(),
    templates: listConfigurationTemplates(),
  });
});

export const POST = withAdmin(async (_ctx, request) => {
  const body = (await request.json()) as CreateProvisioningInput;
  const provisioning = createProvisioning(body);
  return NextResponse.json({ provisioning }, { status: 201 });
});
