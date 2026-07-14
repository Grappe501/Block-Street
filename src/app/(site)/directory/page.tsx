"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Hit = {
  kind: string;
  slug: string;
  name: string;
  county?: string;
  href: string;
};

type Outreach = {
  participants_with_home: number;
  represented_counties: number;
  counties_needing_outreach: number;
  school_homes_committed: number;
};

export default function DirectoryPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [outreach, setOutreach] = useState<Outreach | null>(null);

  useEffect(() => {
    fetch("/api/v1/public/outreach")
      .then((r) => r.json())
      .then((d) => setOutreach(d))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/v1/public/directory/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setHits(d.hits ?? []))
        .catch(() => setHits([]));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Statewide directory</h1>
      <p className="mt-2 text-slate-600">Search every Arkansas county and school in the organizing registry.</p>

      {outreach && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Participants home", outreach.participants_with_home],
            ["Counties with members", outreach.represented_counties],
            ["Counties needing outreach", outreach.counties_needing_outreach],
            ["School homes", outreach.school_homes_committed],
          ].map(([label, val]) => (
            <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-xl font-bold text-brand-700">{val}</p>
              <p className="text-xs text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      )}

      <label className="mt-8 block">
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search counties or schools…"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none ring-brand-500 focus:ring-2"
          autoFocus
        />
      </label>

      <ul className="mt-6 space-y-2">
        {hits.map((h) => (
          <li key={`${h.kind}-${h.slug}`}>
            <Link
              href={h.href}
              className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-brand-400"
            >
              <p className="font-semibold text-slate-900">{h.name}</p>
              <p className="text-xs text-slate-500">
                {h.kind}
                {h.county ? ` · ${h.county}` : ""}
              </p>
            </Link>
          </li>
        ))}
        {q.trim().length >= 2 && hits.length === 0 && (
          <li className="text-sm text-slate-500">No matches.</li>
        )}
      </ul>

      <p className="mt-10 text-center text-sm">
        <Link href="/map" className="text-brand-700 hover:underline">
          Browse by county map
        </Link>
      </p>
    </div>
  );
}
