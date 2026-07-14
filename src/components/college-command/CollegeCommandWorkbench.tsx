"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EducationInstitutionRow } from "@/lib/college-command/dashboard";
import { EducationContactPanel } from "@/components/college-command/EducationContactPanel";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

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
  const kpiParticipants = dashboard.rows.reduce((n, r) => n + r.confirmedParticipants, 0);
  const kpiCampusGoals = dashboard.rows.reduce((n, r) => n + r.institutionSubGoal, 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-gradient-to-r from-brand-800 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-100">
            Under Volunteer Manager · Audience · College Leader
          </p>
          <h1 className="mt-2 text-3xl font-bold">College Leader Workbench</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">
            Specialized education command under Volunteer Manager — every college and high school, RedDirt-backed
            goals with enrollment-share campus sub-goals, progress, board/network inspect, and relay contact.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <FieldManualNavTab variant="header" />
            <Link href={dashboard.parentCommand.href} className="underline text-white/90">
              ↑ {dashboard.parentCommand.label}
            </Link>
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Institutions", s.totalInstitutions],
            ["Colleges", s.colleges],
            ["Secondary", s.highSchools],
            ["Need a lead", s.withoutLead],
            ["Confirmed participants", kpiParticipants],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-600">KPI · goals snapshot</p>
          <p className="mt-1 text-sm text-slate-800">
            {dashboard.meta.county_count} counties · statewide registration goal{" "}
            {dashboard.meta.statewide_registration_goal?.toLocaleString()} · sum of displayed campus registration
            sub-goals in filter table (not additive statewide): use county column for parent totals
          </p>
          <p className="mt-2 text-xs text-slate-600">{dashboard.meta.vci_definition}</p>
          <p className="mt-2 text-xs text-slate-800">
            Active formula: <code>{dashboard.campus_goal_formula_version}</code> —{" "}
            {dashboard.meta.campus_goal_formula}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Source: RedDirt Victory Plan JSON ingest → <code>data/field-goals/county-field-goals.json</code>. Campus
            share uses estimated county VAP until ACS loads. Flat 25% rule is superseded.{" "}
            {dashboard.meta.reddirt_db_warning
              ? "RedDirt DB warning present on chapter-05 artifact (Lane-2 allocation fallback)."
              : null}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Sum of campus registration sub-goals in table (illustrative — do not add on top of county totals):{" "}
            {kpiCampusGoals.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Privacy:</strong> {dashboard.privacyNote}
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
                  "County reg",
                  "County VCI",
                  "Campus reg goal",
                  "Campus VCI goal",
                  "Participants",
                  "Leads",
                  "Vols",
                  "Committee",
                  "Risk",
                  "Inspect",
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
                  <td className="px-3 py-2 tabular-nums">{r.countyVci.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold">{r.institutionSubGoal.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums">{r.campusVciGoal.toLocaleString()}</td>
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
                  <td className="space-x-2 whitespace-nowrap px-3 py-2">
                    <Link
                      href={`${r.boardHref}?inspect=college-command`}
                      className="font-semibold text-brand-800 underline"
                    >
                      Board
                    </Link>
                    <Link
                      href={`${r.countyBoardHref}?inspect=college-command`}
                      className="font-semibold text-brand-800 underline"
                    >
                      County
                    </Link>
                    <Link
                      href={`${r.networkHref}&inspect=college-command`}
                      className="font-semibold text-brand-800 underline"
                    >
                      Network
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Registration progress tiles show confirmed platform participants only. Verified voter-registration
          results from the state: not yet connected. Education sub-goals are shared within each county — do not
          sum school goals into a new statewide total.
        </p>

        <EducationContactPanel snapshots={dashboard.contactSnapshots} />
      </div>
    </div>
  );
}
