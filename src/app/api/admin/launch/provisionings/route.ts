import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listProvisionings } from "@/lib/launch/engine";

export const GET = withAdmin(() => {
  return NextResponse.json({ provisionings: listProvisionings() });
});
