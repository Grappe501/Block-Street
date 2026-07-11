import { NextRequest, NextResponse } from "next/server";
import { createNewVersion, getContentItem, loadContentVersions } from "@/lib/cms/engine";
import { cmsError, withCms } from "@/lib/cms/http";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withCms(() => {
    const item = getContentItem(id);
    if (!item) return NextResponse.json({ error: "Content not found" }, { status: 404 });
    const versions = loadContentVersions().filter((v) => v.content_item_id === id);
    return NextResponse.json({ versions });
  });
  return handler(request).catch(cmsError);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const handler = withCms(async (userId, req) => {
    const body = await req.json();
    const version = createNewVersion(userId, id, body);
    return NextResponse.json({ version }, { status: 201 });
  });
  return handler(request).catch(cmsError);
}
