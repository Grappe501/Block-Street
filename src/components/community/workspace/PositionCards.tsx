"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildSignupHref } from "@/lib/data";
import type { PositionCardView } from "@/lib/position-participation";
import { LEAD_CONFIRMATION } from "@/lib/position-participation/labels";

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
    <div className="mt-3 space-y-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-700">
      {fp.content_status === "placeholder" && (
        <p className="rounded border border-amber-200 bg-amber-50 px-2 py-1 font-medium text-amber-950">
          Field Plan status: placeholder — detailed responsibilities will be added from the campaign Field Plan.
        </p>
      )}
      {rows.map(([label, value]) => (
        <div key={label}>
          <p className="font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-slate-600">{value}</p>
        </div>
      ))}
      <p className="text-[11px] text-slate-500">Source: {fp.source_reference}</p>
    </div>
  );
}

function PositionCard({
  card,
  countySlug,
  schoolSlug,
}: {
  card: PositionCardView;
  countySlug: string;
  schoolSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmLead, setConfirmLead] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localLabel, setLocalLabel] = useState(card.display_label);
  const [myType, setMyType] = useState<"volunteer" | "lead" | null>(null);
  const [message, setMessage] = useState("");

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
      setMessage(participation_type === "lead" ? "You are helping lead this team (co-leads welcome)." : "You are volunteering with this team.");
    } catch {
      setMessage("Could not join team");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-950">{card.position.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{card.position.purpose}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-700">{localLabel}</p>
          {(card.leads.length > 0 || card.volunteers.length > 0) && (
            <p className="mt-1 text-xs text-slate-500">
              {card.leads.length > 0 && (
                <span>
                  {card.leads.length === 1 ? "Lead: " : "Co-leads: "}
                  {card.leads.map((l) => l.display_name).join(", ")}
                </span>
              )}
              {card.volunteers.length > 0 && (
                <span>
                  {card.leads.length > 0 ? " · " : ""}
                  Volunteers: {card.volunteers.length}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {myType === "volunteer" ? (
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800">
              Volunteering
            </span>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => join("volunteer")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
            >
              Volunteer
            </button>
          )}
          {myType === "lead" ? (
            <span className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-900">
              Leading
            </span>
          ) : confirmLead ? (
            <div className="max-w-xs rounded-lg border border-brand-200 bg-brand-50 p-2 text-xs text-brand-950">
              <p>{LEAD_CONFIRMATION}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => join("lead")}
                  className="rounded bg-brand-700 px-2 py-1 font-semibold text-white disabled:opacity-50"
                >
                  Confirm lead
                </button>
                <button type="button" onClick={() => setConfirmLead(false)} className="rounded px-2 py-1 font-semibold text-slate-700">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmLead(true)}
              className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
            >
              Lead
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-left text-xs font-semibold text-brand-700 underline-offset-2 hover:underline"
      >
        What does this team do? {open ? "▴" : "▾"}
      </button>
      {open && <FieldPlanPanel card={card} />}
      {message && <p className="mt-2 text-xs text-slate-700">{message}</p>}
      <p className="mt-2 text-[11px] text-slate-400">
        Prefer join via invite?{" "}
        <Link href={`${signupBase}&role=${card.position.roleKey ?? ""}`} className="underline">
          Continue with signup
        </Link>
      </p>
    </li>
  );
}

export function PositionCards({
  cards,
  countySlug,
  schoolSlug,
}: {
  cards: PositionCardView[];
  countySlug: string;
  schoolSlug?: string;
}) {
  return (
    <section className="card">
      <h2 className="text-lg font-bold text-slate-900">Teams & positions</h2>
      <p className="mt-1 text-sm text-slate-600">
        Volunteer to help — or help lead. Multiple co-leads form the working committee. Lead never means sole owner.
      </p>
      <ul className="mt-4 space-y-3">
        {cards.map((card) => (
          <PositionCard key={card.position.id} card={card} countySlug={countySlug} schoolSlug={schoolSlug} />
        ))}
      </ul>
    </section>
  );
}
