"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Path = "school" | "county" | null;

export default function ChoosePlaceClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [path, setPath] = useState<Path>(null);
  const [counties, setCounties] = useState<{ slug: string; name: string }[]>([]);
  const [county, setCounty] = useState("");
  const [schools, setSchools] = useState<{ slug: string; name: string; kind: string }[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const prefill = useMemo(
    () => ({
      county: params.get("county") || "",
      school: params.get("school") || "",
      kind: params.get("kind") || "",
      name: params.get("name") || "",
    }),
    [params]
  );

  useEffect(() => {
    fetch("/api/auth/session").then(async (r) => {
      if (!r.ok) router.replace("/login?next=/choose-place");
    });
    fetch("/api/launch/home-place")
      .then((r) => r.json())
      .then((d) => {
        if (d.place) router.replace("/network");
      });
  }, [router]);

  useEffect(() => {
    fetch("/api/v1/public/counties")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const list = d?.counties ?? [];
        if (Array.isArray(list) && list.length) {
          setCounties(list.map((c: { slug: string; name: string }) => ({ slug: c.slug, name: c.name })));
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (prefill.school && prefill.name) {
      void commit({
        kind: (prefill.kind as "school" | "high-school" | "private-school") || "school",
        slug: prefill.school,
        name: prefill.name,
        county_slug: prefill.county || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill.school, prefill.name, prefill.kind, prefill.county]);

  async function commit(place: {
    kind: "county" | "school" | "high-school" | "private-school";
    slug: string;
    name: string;
    county_slug?: string;
  }) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/launch/home-place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(place),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not save your place");
      return;
    }
    router.replace("/network");
  }

  async function loadSchools(countySlug: string) {
    setCounty(countySlug);
    setSchools([]);
    try {
      const res = await fetch(`/api/v1/public/schools?county=${encodeURIComponent(countySlug)}`);
      if (res.ok) {
        const d = await res.json();
        const list = d?.schools ?? [];
        if (Array.isArray(list)) {
          setSchools(
            list.map((s: { slug: string; name: string; kind?: string }) => ({
              slug: s.slug,
              name: s.name,
              kind: s.kind || "school",
            }))
          );
        }
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Choose your place</h1>
      <p className="mt-2 text-slate-600">
        Pick your college, high school, or county. After you choose, you won&apos;t need the statewide map — you&apos;ll
        go straight to your home.
      </p>

      {!path && (
        <div className="mt-8 grid gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-left hover:border-brand-400"
            onClick={() => setPath("school")}
          >
            <span className="font-semibold text-slate-900">I&apos;m connected to a school</span>
            <span className="mt-1 block text-sm text-slate-500">College, high school, or private/charter</span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-left hover:border-brand-400"
            onClick={() => setPath("county")}
          >
            <span className="font-semibold text-slate-900">I belong to a county</span>
            <span className="mt-1 block text-sm text-slate-500">Young worker or community path</span>
          </button>
        </div>
      )}

      {path === "county" && (
        <div className="mt-6 space-y-3">
          <button type="button" className="text-sm text-slate-500" onClick={() => setPath(null)}>
            ← Back
          </button>
          <label className="block text-sm font-medium">
            County
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            >
              <option value="">Select…</option>
              {counties.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {county && (
            <button
              type="button"
              disabled={saving}
              className="w-full rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
              onClick={() => {
                const c = counties.find((x) => x.slug === county);
                if (c) void commit({ kind: "county", slug: c.slug, name: c.name });
              }}
            >
              {saving ? "Saving…" : "This is my county"}
            </button>
          )}
        </div>
      )}

      {path === "school" && (
        <div className="mt-6 space-y-3">
          <button type="button" className="text-sm text-slate-500" onClick={() => setPath(null)}>
            ← Back
          </button>
          <label className="block text-sm font-medium">
            County first
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={county}
              onChange={(e) => void loadSchools(e.target.value)}
            >
              <option value="">Select…</option>
              {counties.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {schools.length > 0 && (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-2">
              {schools.map((s) => (
                <button
                  key={`${s.kind}-${s.slug}`}
                  type="button"
                  disabled={saving}
                  className="block w-full rounded-lg px-3 py-2 text-left hover:bg-brand-50"
                  onClick={() =>
                    void commit({
                      kind: (s.kind as "school" | "high-school" | "private-school") || "school",
                      slug: s.slug,
                      name: s.name,
                      county_slug: county,
                    })
                  }
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          {county && !schools.length && (
            <p className="text-sm text-slate-600">
              Or open the{" "}
              <Link href={`/join/community?path=student&county=${county}`} className="text-brand-700 underline">
                school list
              </Link>{" "}
              and tap <strong>Make this your home</strong>.
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
