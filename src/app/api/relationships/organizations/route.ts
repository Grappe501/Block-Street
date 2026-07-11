import { NextResponse } from "next/server";
import { getOrganizationRelationships } from "@/lib/relationships/engine";

export async function GET() {
  const organizations = getOrganizationRelationships();
  return NextResponse.json({ count: organizations.length, organizations });
}
