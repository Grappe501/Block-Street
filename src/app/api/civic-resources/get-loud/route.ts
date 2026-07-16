import { NextResponse } from "next/server";
import { projectGetLoudCard } from "@/lib/civic-resources/registry";
import type { GetLoudCardVariant } from "@/lib/civic-resources/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const variant = (url.searchParams.get("variant") ?? "compact") as GetLoudCardVariant;
  const locale = url.searchParams.get("locale") === "es" ? "es" : "en";
  const projection = projectGetLoudCard(variant, locale);
  if (!projection) return NextResponse.json({ error: "Resource unavailable" }, { status: 404 });
  return NextResponse.json({ projection });
}
