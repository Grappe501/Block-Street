import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadTemplates } from "@/lib/notifications/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ templates: loadTemplates() });
});
