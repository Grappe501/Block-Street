"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { JOIN_INTEREST_STORAGE_KEY, type JoinInterestRecord } from "@/lib/meeting/july14-registry";
import { COLLEGE_POSITIONS } from "@/lib/meeting/positions-catalog";

export default function July14CommitmentsPage() {
  const [interests, setInterests] = useState<JoinInterestRecord[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(JOIN_INTEREST_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as JoinInterestRecord[];
      if (Array.isArray(parsed)) setInterests(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            College Command · soft beta
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Commitments</h1>
          <p className="mt-3 text-sm text-slate-600">
            Soft-beta interest notes from this browser. These are welcomes — not appointments and not fabricated personnel.
          </p>
          <p className="mt-4 text-sm font-semibold">
            <Link
              href="/admin/college-command/meeting/july-14"
              className="text-brand-800 underline-offset-2 hover:underline"
            >
              ← Meeting workspace
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        {interests.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
            No local interest notes yet. Point people to{" "}
            <Link href="/join/interest" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
              /join/interest
            </Link>{" "}
            or open seats.
          </p>
        ) : (
          <ul className="space-y-3">
            {interests.map((row, index) => {
              const title =
                COLLEGE_POSITIONS.find((p) => p.id === row.positionId)?.title ?? row.positionId;
              return (
                <li key={`${row.savedAt}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
                  <p className="font-semibold text-slate-950">{row.name}</p>
                  <p className="mt-1 text-slate-600">
                    {title}
                    {row.campusOrPlace ? ` · ${row.campusOrPlace}` : ""}
                  </p>
                  {row.note ? <p className="mt-2 text-slate-700">{row.note}</p> : null}
                  <p className="mt-2 text-xs text-slate-500">{new Date(row.savedAt).toLocaleString()}</p>
                </li>
              );
            })}
          </ul>
        )}

        <HonestyPanel
          workingNow={["Local interest notes", "Open seat CTAs"]}
          stillCompleting={["Shared durable commitments store", "Role appointments"]}
        />
      </main>
    </div>
  );
}
