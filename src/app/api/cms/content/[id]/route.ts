import { NextRequest, NextResponse } from "next/server";
import { assertContentPermission, getContentItem, getVersionById } from "@/lib/cms/engine";
import { cmsError, withCms } from "@/lib/cms/http";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const handler = withCms((userId) => {
      assertContentPermission(userId, "content.view");
      const item = getContentItem(id);
      if (!item) return NextResponse.json({ error: "Content not found" }, { status: 404 });
      const version = getVersionById(item.current_version_id);
      return NextResponse.json({ item, version });
    });
    return handler(request);
  } catch (e) {
    return cmsError(e);
  }
}
