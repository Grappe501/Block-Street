import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadApiClients } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  return NextResponse.json({ clients: loadApiClients() });
});
