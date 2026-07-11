import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadAiTools } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  return NextResponse.json({ tools: loadAiTools() });
});
