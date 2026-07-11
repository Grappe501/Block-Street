import { NextResponse } from "next/server";
import { readCmsAudit } from "@/lib/cms/engine";
import { withCms } from "@/lib/cms/http";

export const GET = withCms(() => {
  return NextResponse.json({ events: readCmsAudit().slice(-50).reverse() });
});
