"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Institution } from "@/lib/data";

export function CollegePicker({ colleges }: { colleges: Institution[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return colleges.slice(0, 40);
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.shortName.toLowerCase().includes(needle) ||
        c.city.toLowerCase().includes(needle) ||
        c.county.toLowerCase().includes(needle),
    );
  }, [colleges, q]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-800">
        Search colleges
        <input
          className="mt-1 w-full rounded-lg border px-3 py-3 text-sm"
          placeholder="Name, city, or county"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </label>
      <ul className="mt-4 space-y-2">
        {filtered.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/college/${c.slug}`}
              className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400"
            >
              <p className="font-semibold text-slate-900">{c.shortName || c.name}</p>
              <p className="text-xs text-slate-600">
                {c.city} · {c.county} County · {c.type.replaceAll("_", " ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? <p className="mt-4 text-sm text-slate-500">No matches — try another spelling.</p> : null}
    </div>
  );
}
