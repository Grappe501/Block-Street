"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CommitPlaceButton({
  kind,
  slug,
  name,
  countySlug,
}: {
  kind: "county" | "school" | "high-school" | "private-school";
  slug: string;
  name: string;
  countySlug?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function commit() {
    setBusy(true);
    setMsg("");
    const session = await fetch("/api/auth/session");
    if (!session.ok) {
      const q = new URLSearchParams({
        kind,
        school: kind === "county" ? "" : slug,
        county: kind === "county" ? slug : countySlug || "",
        name,
      });
      router.push(`/login?next=${encodeURIComponent(`/choose-place?${q.toString()}`)}`);
      return;
    }
    const res = await fetch("/api/launch/home-place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, slug, name, county_slug: countySlug }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Could not save");
      return;
    }
    router.push("/app");
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
      <p className="text-sm font-semibold text-brand-950">Make this your home</p>
      <p className="mt-1 text-sm text-brand-800">
        After you choose, the statewide map goes away. You&apos;ll land in your home area.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void commit()}
        className="mt-3 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Saving…" : `Choose ${name}`}
      </button>
      {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
    </div>
  );
}
