"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InstitutionRow = {
  institution_id: string;
  membership_id: string;
  membership_status: string;
  institution_trust_state: string;
  role: string;
  joined_at: string;
};

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);
  const [activeContext, setActiveContext] = useState<Record<string, unknown> | null>(null);
  const [assurance, setAssurance] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/v1/identity/me/institutions")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data ?? d;
        setInstitutions(data.institutions ?? []);
        setActiveContext(data.active_context ?? null);
        setAssurance(data.portable_assurance ?? null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const enterInstitution = async (institutionId: string) => {
    setMessage("");
    const res = await fetch("/api/v1/context/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institution_id: institutionId }),
    });
    const d = await res.json();
    if (!res.ok) {
      setMessage(d.error?.message ?? "Context switch failed");
      return;
    }
    setMessage(`Active context: ${institutionId}`);
    load();
  };

  if (loading) return <div className="p-6">Loading institutions…</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">My institutions</h1>
      <p className="text-sm text-slate-600">
        One Human identity, many governed memberships. Authority is institution-specific.
      </p>

      {activeContext && (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4" role="status" aria-live="polite">
          <p className="font-semibold text-emerald-900">Current institution context</p>
          <p className="text-sm text-emerald-800">{String(activeContext.institution_id)}</p>
        </div>
      )}

      {assurance && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">Portable identity assurance</p>
          <p className="text-xs text-slate-600">
            Status: {String((assurance as { current_status?: string }).current_status)} · Claims:{" "}
            {((assurance as { permitted_claims?: string[] }).permitted_claims ?? []).join(", ")}
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {institutions.map((inst) => (
          <li key={inst.membership_id} className="rounded border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{inst.institution_id}</p>
                <p className="text-sm text-slate-600">
                  {inst.role} · {inst.membership_status} · {inst.institution_trust_state}
                </p>
              </div>
              <button
                type="button"
                onClick={() => enterInstitution(inst.institution_id)}
                className="rounded bg-indigo-700 px-3 py-1.5 text-sm text-white"
                aria-label={`Switch to ${inst.institution_id}`}
              >
                Enter
              </button>
            </div>
          </li>
        ))}
      </ul>

      {institutions.length === 0 && (
        <p className="text-sm text-slate-500">No institution memberships yet.</p>
      )}

      {message && <p className="text-sm text-indigo-800">{message}</p>}

      <Link href="/identity/invitations/cross-institution" className="text-sm text-indigo-700 underline">
        Cross-institution invitations
      </Link>
    </div>
  );
}
