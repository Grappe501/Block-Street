import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadDuplicateCandidates } from "@/lib/identity-trust/wave1/data";

export const GET = withAdmin(() => NextResponse.json({ duplicate_candidates: loadDuplicateCandidates() }));
