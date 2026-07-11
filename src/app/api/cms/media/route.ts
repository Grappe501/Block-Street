import { NextResponse } from "next/server";
import { loadMediaAssets } from "@/lib/cms/engine";
import { withCms } from "@/lib/cms/http";

export const GET = withCms(() => {
  return NextResponse.json({ assets: loadMediaAssets() });
});
