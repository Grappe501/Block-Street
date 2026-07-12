import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { listWave1Invitations } from "@/lib/identity-trust/wave1/engine";

export const GET = withAdmin(() => NextResponse.json({ invitations: listWave1Invitations() }));
