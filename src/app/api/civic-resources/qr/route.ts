import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { assertSafeQrUrl, getActiveExternalCivicResource } from "@/lib/civic-resources/registry";

export async function GET(request: NextRequest) {
  const resourceKey = new URL(request.url).searchParams.get("resource");
  if (!resourceKey) {
    return NextResponse.json({ error: "resource parameter required" }, { status: 400 });
  }

  const resource = getActiveExternalCivicResource(resourceKey);
  if (!resource || !resource.qrEnabled) {
    return NextResponse.json({ error: "QR not available for resource" }, { status: 404 });
  }

  try {
    assertSafeQrUrl(resource.url);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  const png = await QRCode.toBuffer(resource.url, {
    type: "png",
    width: 512,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return new NextResponse(Buffer.from(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `inline; filename="${resourceKey}-qr.png"`,
    },
  });
}
