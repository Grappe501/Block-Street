import { NextResponse } from "next/server";
import { listTemplates } from "@/lib/missions/engine";

export async function GET() {
  const templates = listTemplates();
  return NextResponse.json({ count: templates.length, templates });
}
