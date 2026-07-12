"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrustPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/v1/identity/me/trust")
      .then((r) => r.json())
      .then((d) => setData(d.data ?? null));
  }, []);

  const trust = data?.trust as Record<string, unknown> | undefined;
  const capabilities = (trust?.capabilities as Record<string, boolean | string>) ?? {};
  const ledger = (data?.ledger_summary as { event_type: string; new_state: string | null }[]) ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Trust status</h1>
      <p className="text-sm text-slate-600">Named trust stages — not a hidden score.</p>

      {trust && (
        <>
          <div className="rounded border border-indigo-200 bg-indigo-50 p-4 text-sm">
            <p>
              <strong>Global assurance:</strong> {String(trust.assurance_state)}
            </p>
            <p>
              <strong>Institution trust:</strong> {String(trust.institution_trust)}
            </p>
            <p>
              <strong>Badge:</strong> {String(trust.public_badge)}
            </p>
            <p className="mt-2">{String(trust.next_action)}</p>
          </div>

          <div className="rounded border border-slate-200 p-4 text-sm">
            <h2 className="font-semibold">Capability eligibility</h2>
            <ul className="mt-2 space-y-1">
              {Object.entries(capabilities).map(([cap, val]) => (
                <li key={cap}>
                  {cap.replace(/_/g, " ")}: {String(val)}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-slate-200 p-4 text-sm">
            <h2 className="font-semibold">Identity timeline (safe summary)</h2>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {ledger.map((e, i) => (
                <li key={i}>
                  {e.event_type} → {e.new_state ?? "—"}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Link href="/identity/verification" className="text-sm text-indigo-700 underline">
        Back to verification
      </Link>
    </div>
  );
}
