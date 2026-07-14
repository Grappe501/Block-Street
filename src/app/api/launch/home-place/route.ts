import { NextRequest, NextResponse } from "next/server";
import { hydrateAuthStore, setHomePlaceForUser, type HomePlace } from "@/lib/auth/data";
import { getSessionFromRequest } from "@/lib/auth/session";

const PLACE_COOKIE = "bs_home_place";

export async function POST(request: NextRequest) {
  await hydrateAuthStore();
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = (await request.json()) as {
    kind?: HomePlace["kind"];
    slug?: string;
    name?: string;
    county_slug?: string;
  };

  if (!body.kind || !body.slug || !body.name) {
    return NextResponse.json({ error: "kind, slug, and name required" }, { status: 400 });
  }

  const place: HomePlace = {
    user_id: session.user_id,
    kind: body.kind,
    slug: body.slug,
    name: body.name,
    county_slug: body.county_slug,
    committed_at: new Date().toISOString(),
  };
  setHomePlaceForUser(place);

  const res = NextResponse.json({ ok: true, place });
  res.cookies.set(PLACE_COOKIE, JSON.stringify({ kind: place.kind, slug: place.slug, name: place.name }), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function GET(request: NextRequest) {
  await hydrateAuthStore();
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) return NextResponse.json({ place: null });
  const { getHomePlaceForUser } = await import("@/lib/auth/data");
  return NextResponse.json({ place: getHomePlaceForUser(session.user_id) });
}
