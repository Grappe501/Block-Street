"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InstitutionRow = {
  institution_id: string;
  institution_name?: string;
  membership_status: string;
  role: string;
};

export function InstitutionSwitcher({ compact = false }: { compact?: boolean }) {
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/identity/me/institutions")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data ?? d;
        setInstitutions(data.institutions ?? []);
        setActiveId((data.active_context as { institution_id?: string })?.institution_id ?? null);
      });
  }, []);

  const active = institutions.find((i) => i.institution_id === activeId) ?? institutions[0];

  async function switchTo(institutionId: string) {
    await fetch("/api/v1/context/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institution_id: institutionId }),
    });
    setActiveId(institutionId);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("institution-context-changed", { detail: { institution_id: institutionId } }));
  }

  if (institutions.length === 0) return null;

  const label = active?.institution_name ?? active?.institution_id ?? "Institution";

  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="max-w-[12rem] truncate rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-900"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {label}
        </button>
        {open && (
          <ul className="absolute right-0 z-20 mt-1 min-w-[14rem] rounded border bg-white shadow-lg" role="listbox">
            {institutions.map((inst) => (
              <li key={inst.institution_id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={inst.institution_id === activeId}
                  onClick={() => switchTo(inst.institution_id)}
                  className="block w-full px-3 py-2 text-left text-xs hover:bg-emerald-50"
                >
                  <span className="font-medium">{inst.institution_name ?? inst.institution_id}</span>
                  <span className="block text-slate-500">{inst.role} · {inst.membership_status}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="rounded border border-emerald-200 bg-emerald-50 p-3" role="region" aria-label="Current institution">
      <p className="text-xs font-semibold uppercase text-emerald-800">Current Institution</p>
      <p className="text-sm font-bold text-emerald-950">{label}</p>
      {active && (
        <p className="text-xs text-emerald-800">
          {active.role} · {active.membership_status}
        </p>
      )}
      {institutions.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {institutions.map((inst) => (
            <button
              key={inst.institution_id}
              type="button"
              onClick={() => switchTo(inst.institution_id)}
              disabled={inst.institution_id === activeId}
              className="rounded border border-emerald-400 px-2 py-1 text-xs text-emerald-900 disabled:opacity-50"
            >
              {inst.institution_name ?? inst.institution_id}
            </button>
          ))}
        </div>
      )}
      <Link href="/identity/institutions" className="mt-2 inline-block text-xs text-emerald-800 underline">
        Manage institutions
      </Link>
    </div>
  );
}
