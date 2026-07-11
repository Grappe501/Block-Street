import { NextResponse } from "next/server";
import { loadContentTypes } from "@/lib/cms/engine";

export async function GET() {
  const types = loadContentTypes().filter((t) => t.status === "active");
  return NextResponse.json({ content_types: types });
}
