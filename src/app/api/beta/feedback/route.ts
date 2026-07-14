import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { randomBytes } from "crypto";
import { readDurableText, writeDurableTextAsync, hydrateNamespace } from "@/lib/persist/durable-json";
import { getSessionFromRequest } from "@/lib/auth/session";
import { loadUsers } from "@/lib/auth/data";

const NS = "beta-feedback";
const KEY = "submissions.json";
const SEED = join(process.cwd(), "data", "beta-feedback", "submissions.json");

type FeedbackRow = {
  id: string;
  created_at: string;
  sentiment: "loved" | "mixed" | "frustrated";
  areas: string[];
  what_worked: string;
  what_hurt: string;
  request: string;
  campus_or_place: string;
  contact_ok: boolean;
  email: string | null;
  user_id: string | null;
};

async function loadRows(): Promise<FeedbackRow[]> {
  await hydrateNamespace(NS, [KEY], () => SEED);
  try {
    const text = readDurableText(NS, KEY, SEED);
    const parsed = JSON.parse(text) as { submissions?: FeedbackRow[] };
    return parsed.submissions ?? [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<FeedbackRow> & {
    what_worked?: string;
    what_hurt?: string;
    request?: string;
  };

  const sentiment = body.sentiment;
  if (sentiment !== "loved" && sentiment !== "mixed" && sentiment !== "frustrated") {
    return NextResponse.json({ error: "Choose how this beta felt for you." }, { status: 400 });
  }

  const what_worked = String(body.what_worked ?? "").trim();
  const what_hurt = String(body.what_hurt ?? "").trim();
  const requestText = String(body.request ?? "").trim();
  if (!what_worked && !what_hurt && !requestText) {
    return NextResponse.json({ error: "Share at least one note — praise, friction, or a request." }, { status: 400 });
  }

  let email: string | null = null;
  let user_id: string | null = null;
  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (session) {
    user_id = session.user_id;
    email = loadUsers().find((u) => u.user_id === session.user_id)?.primary_email ?? null;
  }

  const row: FeedbackRow = {
    id: `fb-${randomBytes(6).toString("hex")}`,
    created_at: new Date().toISOString(),
    sentiment,
    areas: Array.isArray(body.areas) ? body.areas.map(String).slice(0, 12) : [],
    what_worked,
    what_hurt,
    request: requestText,
    campus_or_place: String(body.campus_or_place ?? "").trim().slice(0, 120),
    contact_ok: Boolean(body.contact_ok),
    email: body.contact_ok ? email : null,
    user_id,
  };

  const rows = await loadRows();
  rows.unshift(row);
  await writeDurableTextAsync(NS, KEY, JSON.stringify({ version: "1.0.0", submissions: rows }, null, 2), SEED);

  return NextResponse.json({ ok: true, id: row.id, message: "Thank you — we read every note." });
}
