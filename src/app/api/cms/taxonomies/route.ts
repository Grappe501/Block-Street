import { NextResponse } from "next/server";
import { loadTaxonomy } from "@/lib/cms/data";
import { withCms } from "@/lib/cms/http";

export const GET = withCms(() => {
  const taxonomy = loadTaxonomy();
  return NextResponse.json(taxonomy);
});
