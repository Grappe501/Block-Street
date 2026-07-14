"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EducationInstitutionRow } from "@/lib/college-command/dashboard";

type Dash = ReturnType<typeof import("@/lib/college-command/dashboard").buildCollegeCommandDashboard>;

export function CollegeCommandWorkbench({ dashboard }: { dashboard: Dash }) {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "college" | "high_school">("all");
  const [leadFilter, setLeadFilter] = useState<"all" | "needs_lead" | "has_lead">("all");

  const rows = useMemo(() => {
    return dashboard.rows.filter((r: EducationInstitutionRow) => {
      if (typeFilter === "college" && r.kind !== "institution") return false;
      if (typeFilter === "high_school" && r.kind === "institution") return false;
      if (leadFilter === "needs_lead" && r.leadCount > 0) return false;
      if (leadFilter === "has_lead" && r.leadCount === 0) return false;
      if (q) {
        const hay = `${r.name} ${r.countyName} ${r.type}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [dashboard.rows, q, typeFilter, leadFilter]);

  const s = dashboard.summary;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-gradient-to-r from-brand-800 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-100">Audience · College Leader</p>
          <h1 className="mt-2 text-3xl font-bold">College Leader Workbench</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">
            Statewide education command — colleges, high schools, county RedDirt goals, and 25% institution
            sub-goals. Not a participant landing page.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/admin?tab=command" className="underline text-white/90">
              Operator Command
            </Link>
            <Link href="/admin/director" className="underline text-white/90">
              Director Omniview
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Institutions", s.totalInstitutions],
            ["Colleges", s.colleges],
            ["Secondary schools", s.highSchools],
            ["Need a lead", s.withoutLead],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Privacy:</strong> {dashboard.privacyNote}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-600">Field goal snapshot</p>
          <p className="mt-1 text-sm text-slate-800">
            {dashboard.meta.county_count} counties · statewide registration goal{" "}
            {dashboard.meta.statewide_registration_goal?.toLocaleString()} · ingested {dashboard.meta.ingested_at}
          </p>
          <p className="mt-2 text-xs text-slate-600">{dashboard.meta.vci_definition}</p>
          <p className="mt-2 text-xs text-slate-600">
            Rule: {dashboard.meta.institution_sub_goal_rule} · contribution model: sub_goal_within_parent
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search institution or county"
            className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All types</option>
            <option value="college">Colleges</option>
            <option value="high_school">High / secondary</option>
          </select>
          <select
            value={leadFilter}
            onChange={(e) => setLeadFilter(e.target.value as typeof leadFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">Any lead status</option>
            <option value="needs_lead">Needs lead</option>
            <option value="has_lead">Has lead</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                {[
                  "Institution",
                  "Type",
                  "County",
                  "County goal",
                  "Sub-goal (25%)",
                  "Participants",
                  "Leads",
                  "Volunteers",
                  "Committee",
                  "Risk",
                  "",
                ].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 text-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-950">{r.shortName}</td>
                  <td className="px-3 py-2">{r.type}</td>
                  <td className="px-3 py-2">{r.countyName}</td>
                  <td className="px-3 py-2 tabular-nums">{r.countyGoal.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold">{r.institutionSubGoal.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums">{r.confirmedParticipants}</td>
                  <td className="px-3 py-2 tabular-nums">{r.leadCount}</td>
                  <td className="px-3 py-2 tabular-nums">{r.volunteerCount}</td>
                  <td className="px-3 py-2">{r.committeeLabel}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        r.risk === "needs_lead"
                          ? "bg-amber-100 text-amber-950"
                          : r.risk === "forming"
                            ? "bg-sky-100 text-sky-950"
                            : "bg-emerald-100 text-emerald-950"
                      }`}
                    >
                      {r.risk}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`${r.boardHref}?inspect=college-command`} className="font-semibold text-brand-800 underline">
                      Open board
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Registration progress shows confirmed platform participants only. Verified voter-registration results: not
          yet connected.
        </p>
      </div>
    </div>
  );
}
