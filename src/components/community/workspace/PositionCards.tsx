"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildSignupHref } from "@/lib/data";
import type { PositionCardView, TeamDisplayLabel } from "@/lib/position-participation";
import {
  FIELD_PLAN_PLACEHOLDER,
  LEAD_CONFIRMATION,
  LEAD_MEANING,
  VOLUNTEER_MEANING,
} from "@/lib/position-participation/labels";

const LABEL_CHIP: Record<TeamDisplayLabel, string> = {
  "Help Build This Team": "bg-amber-100 text-amber-950 ring-1 ring-amber-200",
  "Volunteer Team Forming": "bg-sky-100 text-sky-950 ring-1 ring-sky-200",
  Lead: "bg-brand-100 text-brand-950 ring-1 ring-brand-200",
  "Co-Leads": "bg-brand-100 text-brand-950 ring-1 ring-brand-300",
  Committee: "bg-emerald-100 text-emerald-950 ring-1 ring-emerald-200",
};

function FieldPlanPanel({ card }: { card: PositionCardView }) {
  const fp = card.field_plan;
  const rows: Array<[string, string]> = [
    ["Purpose in field strategy", fp.purpose],
    ["Before events", fp.before_event],
    ["During events", fp.event_day],
    ["After events", fp.after_event],
    ["Canvassing", fp.canvassing],
    ["GOTV", fp.gotv],
    ["Time commitment", fp.time_commitment],
    ["Helpful skills", fp.helpful_skills],
    ["Central campaign counterpart", fp.central_counterpart],
    ["Current local needs", fp.local_needs],
  ];

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
      {fp.content_status === "placeholder" && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 font-medium text-amber-950">
          Field Plan status: placeholder — {FIELD_PLAN_PLACEHOLDER}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="mt-1 leading-relaxed text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-600">Source: {fp.source_reference}</p>
    </div>
  );
}

function PositionCard({
  card,
  countySlug,
  schoolSlug,
  primaryColor,
}: {
  card: PositionCardView;
  countySlug: string;
  schoolSlug?: string;
  primaryColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmLead, setConfirmLead] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localLabel, setLocalLabel] = useState(card.display_label);
  const [myType, setMyType] = useState<"volunteer" | "lead" | null>(null);
  const [message, setMessage] = useState("");
  const accent = primaryColor ?? "#0d9488";

  const signupBase = useMemo(
    () => buildSignupHref({ county: countySlug, school: schoolSlug }),
    [countySlug, schoolSlug]
  );

  async function join(participation_type: "volunteer" | "lead") {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/position-memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope_type: card.scope_type,
          scope_id: card.scope_id,
          position_id: card.position.id,
          participation_type,
          display_name: participation_type === "lead" ? "Lead volunteer" : "Volunteer",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = `${signupBase}&role=${card.position.roleKey ?? ""}&participation=${participation_type}`;
          return;
        }
        setMessage(data.error || "Could not join team");
        return;
      }
      setMyType(participation_type);
      setLocalLabel(data.display_label ?? localLabel);
      setConfirmLead(false);
      setMessage(
        participation_type === "lead"
          ? "You are helping lead this team (co-leads welcome)."
          : "You are volunteering with this team."
      );
    } catch {
      setMessage("Could not join team");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: accent }}
        aria-hidden
      />
      <div className="p-5 pl-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-950">{card.position.title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${LABEL_CHIP[localLabel]}`}>
                {localLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{card.position.purpose}</p>
            {(card.leads.length > 0 || card.volunteers.length > 0) && (
              <p className="mt-2 text-xs text-slate-600">
                {card.leads.length > 0 && (
                  <span>
                    {card.leads.length === 1 ? "Lead: " : "Co-leads: "}
                    <span className="font-medium text-slate-900">
                      {card.leads.map((l) => l.display_name).join(", ")}
                    </span>
                  </span>
                )}
                {card.volunteers.length > 0 && (
                  <span>
                    {card.leads.length > 0 ? " · " : ""}
                    Volunteers:{" "}
                    <span className="font-medium text-slate-900">{card.volunteers.length}</span>
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex max-w-sm flex-col gap-2">
            <div className="flex flex-wrap items-start gap-2">
              {myType === "volunteer" ? (
                <span className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900">
                  Volunteering
                </span>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  title={VOLUNTEER_MEANING}
                  onClick={() => join("volunteer")}
                  className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  {myType === "lead" ? "Switch to Volunteer" : "Volunteer"}
                </button>
              )}
              {myType === "lead" ? (
                <span className="rounded-xl border border-brand-300 bg-brand-100 px-3 py-2 text-xs font-semibold text-brand-950">
                  Leading
                </span>
              ) : confirmLead ? (
                <div className="max-w-xs rounded-xl border border-brand-300 bg-brand-50 p-3 text-xs text-brand-950 shadow-sm">
                  <p className="font-semibold">Help lead — not sole ownership</p>
                  <p className="mt-1 leading-relaxed">{LEAD_CONFIRMATION}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => join("lead")}
                      className="rounded-lg bg-brand-700 px-3 py-1.5 font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
                    >
                      Confirm lead
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmLead(false)}
                      className="rounded-lg px-3 py-1.5 font-semibold text-slate-800 hover:bg-white/70"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  title={LEAD_MEANING}
                  onClick={() => setConfirmLead(true)}
                  className="rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-50"
                >
                  {myType === "volunteer" ? "Switch to Lead" : "Lead"}
                </button>
              )}
            </div>
            {!myType && !confirmLead ? (
              <dl className="space-y-1 text-[11px] leading-snug text-slate-600">
                <div>
                  <dt className="inline font-semibold text-slate-800">Volunteer: </dt>
                  <dd className="inline">{VOLUNTEER_MEANING}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-slate-800">Lead: </dt>
                  <dd className="inline">{LEAD_MEANING}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          What does this team do?{" "}
          <span aria-hidden className="text-slate-500">
            {open ? "▴" : "▾"}
          </span>
        </button>
        {open && <FieldPlanPanel card={card} />}
        {message ? <p className="mt-3 text-xs font-medium text-emerald-900">{message}</p> : null}
        <p className="mt-3 text-[11px] text-slate-500">
          Prefer join via invite?{" "}
          <Link
            href={`${signupBase}&role=${card.position.roleKey ?? ""}`}
            className="font-semibold text-brand-800 underline decoration-brand-300 underline-offset-2 hover:text-brand-950"
          >
            Continue with signup
          </Link>
        </p>
      </div>
    </li>
  );
}

export function PositionCards({
  cards,
  countySlug,
  schoolSlug,
  primaryColor,
}: {
  cards: PositionCardView[];
  countySlug: string;
  schoolSlug?: string;
  primaryColor?: string;
}) {
  const accent = primaryColor ?? "#0d9488";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="border-b border-slate-100 px-6 py-5"
        style={{
          background: `linear-gradient(135deg, ${accent}18 0%, #ffffff 50%, #f1f5f9 100%)`,
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">Teams</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Positions you can join</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-700">
          Volunteer to help — or help lead. Multiple co-leads form the working committee. Lead never means sole
          owner.
        </p>
      </div>
      <ul className="space-y-3 p-5 sm:p-6">
        {cards.map((card) => (
          <PositionCard
            key={card.position.id}
            card={card}
            countySlug={countySlug}
            schoolSlug={schoolSlug}
            primaryColor={primaryColor}
          />
        ))}
      </ul>
    </section>
  );
}
