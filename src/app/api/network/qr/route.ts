import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { hydrateAuthStore } from "@/lib/auth/data";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getNetworkBoard, hydrateNetworkStore } from "@/lib/network";

export async function GET(request: NextRequest) {
  await hydrateAuthStore();
  await hydrateNetworkStore();
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const board = getNetworkBoard(session.user_id);
  if (!board) return NextResponse.json({ error: "Network board not found" }, { status: 404 });

  const origin = new URL(request.url).origin;
  const shareUrl = `${origin}${board.share_url_path}`;
  const png = await QRCode.toBuffer(shareUrl, { type: "png", width: 512, margin: 2 });

  return new NextResponse(Buffer.from(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=300",
      "Content-Disposition": `attachment; filename="${board.profile.share_slug}-qr.png"`,
    },
  });
}
