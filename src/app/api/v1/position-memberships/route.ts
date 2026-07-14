import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/engine";
import { deriveTeamDisplayLabel } from "@/lib/position-participation/labels";
import { loadPositionStore, resolveCanonicalPersonId } from "@/lib/position-participation/store";
import { upsertMembership } from "@/lib/position-participation/service";
import type { ParticipationType, ScopeType } from "@/lib/position-participation/types";

export async function GET(request: NextRequest) {
  const scopeId = request.nextUrl.searchParams.get("scope_id");
  if (!scopeId) {
    return NextResponse.json({ error: "scope_id required" }, { status: 400 });
  }
  const store = loadPositionStore();
  const memberships = store.memberships.filter((m) => m.scope_id === scopeId && m.status === "active");
  return NextResponse.json({ memberships, persons: store.persons.filter((p) => p.scopes.includes(scopeId)) });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request.headers.get("cookie"));
  const body = await request.json().catch(() => ({}));

  const scope_type = body.scope_type as ScopeType;
  const scope_id = body.scope_id as string;
  const position_id = body.position_id as string;
  const participation_type = body.participation_type as ParticipationType;

  if (!scope_type || !scope_id || !position_id || !["volunteer", "lead"].includes(participation_type)) {
    return NextResponse.json({ error: "Invalid membership payload" }, { status: 400 });
  }

  if (!session) {
    return NextResponse.json(
      {
        error: "Sign in or accept an invitation to join a team",
        requires_auth: true,
      },
      { status: 401 }
    );
  }

  const person_id = session.user_id;
  const membership = upsertMembership({
    scope_type,
    scope_id,
    position_id,
    person_id,
    participation_type,
    display_name: body.display_name,
  });

  const store = loadPositionStore();
  const siblings = store.memberships.filter((m) => m.position_id === position_id && m.status === "active");
  const leads = siblings.filter((m) => m.participation_type === "lead").length;
  const volunteers = siblings.filter((m) => m.participation_type === "volunteer").length;

  return NextResponse.json({
    membership,
    canonical_person_id: resolveCanonicalPersonId(person_id, store),
    display_label: deriveTeamDisplayLabel(leads, volunteers),
  });
}
