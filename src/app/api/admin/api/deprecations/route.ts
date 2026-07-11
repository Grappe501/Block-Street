import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadDeprecations } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  return NextResponse.json({ deprecations: loadDeprecations() });
});
