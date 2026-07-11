import { NextResponse } from "next/server";
import { loadIntegrations } from "@/lib/admin/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";

export const GET = withAdmin((ctx) => {
  assertAdminPermission(ctx, "integrations.configure");
  const integrations = loadIntegrations().map((i) => ({
    ...i,
    credential_reference: i.credential_reference ? "[protected]" : null,
  }));
  return NextResponse.json({ integrations });
});
