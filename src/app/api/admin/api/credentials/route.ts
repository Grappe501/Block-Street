import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadApiCredentials } from "@/lib/api/gateway";

export const GET = withAdmin(() => {
  const creds = loadApiCredentials().map(({ credential_hash_or_reference: _, ...safe }) => safe);
  return NextResponse.json({ credentials: creds });
});
