"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdentityShell } from "@/components/identity/IdentityShell";
import { useIdentityLocale } from "@/components/identity/LanguageToggle";

type HomeData = {
  public_name?: string;
  global_human_id_masked?: string;
  global_human_id?: string;
  assurance_state?: string;
  assurance_explanation?: string;
  public_badge?: string;
  preferred_name?: string;
  approved_alias?: string | null;
  next_action?: { action: string; priority?: string } | null;
  sponsor_lineage?: {
    sponsor_public_name: string;
    invitation_accepted_at: string | null;
    institution_of_entry: string;
    sponsor_status: string;
  } | null;
  invitation_privilege?: { available: number; sent: number; quota: number };
  memberships?: { institution_id: string; institution_name?: string; status: string; role: string; trust_state: string }[];
  timeline?: { event_type: string; occurred_at: string; summary: string }[];
  verification_progress?: { qualifying: number; required: number };
};

function IdentityCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-slate-200 p-4">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      <div className="mt-2 text-sm text-slate-700">{children}</div>
    </section>
  );
}

export default function IdentityPage() {
  const { t } = useIdentityLocale();
  const [home, setHome] = useState<HomeData | null>(null);

  useEffect(() => {
    fetch("/api/v1/identity/home")
      .then((r) => r.json())
      .then((d) => setHome(d.data ?? d));
  }, []);

  const nav = (
    <>
      <Link href="/july-14" className="rounded bg-indigo-700 px-2 py-1 text-white">July 14</Link>
      <Link href="/identity/sponsor" className="rounded border px-2 py-1">{t("sponsor.title")}</Link>
      <Link href="/identity/verification" className="rounded border px-2 py-1">{t("verification.title")}</Link>
      <Link href="/support/identity" className="rounded border px-2 py-1">{t("join.support")}</Link>
    </>
  );

  return (
    <IdentityShell title={t("identity.home")} subtitle="Public human identity — not a username." nav={nav}>
      {home && (
        <div className="rounded border border-indigo-200 bg-indigo-50 p-4" role="region" aria-label="Identity status">
          <p className="text-xl font-bold text-indigo-950">{home.public_name}</p>
          <p className="text-sm text-indigo-900" role="status">
            {home.public_badge ?? home.assurance_state}
          </p>
          <p className="mt-1 text-xs text-indigo-800">
            Global Human ID: {home.global_human_id_masked ?? home.global_human_id}
          </p>
          <p className="mt-2 text-sm text-indigo-900">{home.assurance_explanation}</p>
        </div>
      )}

      {home?.next_action && (
        <div className="rounded border-2 border-amber-400 bg-amber-50 p-4" role="status" aria-live="polite">
          <p className="text-xs font-semibold uppercase text-amber-800">{t("identity.next_action")}</p>
          <p className="text-base font-medium text-amber-950">{home.next_action.action}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {home.assurance_state === "sponsored" && (
              <Link href="/identity/verification" className="rounded bg-amber-700 px-4 py-2 text-sm text-white">
                {t("verification.request")}
              </Link>
            )}
            <Link href="/july-14" className="rounded border border-amber-600 px-4 py-2 text-sm text-amber-900">
              {t("join.july14_entry")}
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <IdentityCard title={t("identity.my_identity")}>
          <p><strong>Public name:</strong> {home?.public_name}</p>
          <p><strong>Preferred:</strong> {home?.preferred_name}</p>
          {home?.approved_alias && <p><strong>Approved alias:</strong> {home.approved_alias}</p>}
          <p><strong>Assurance:</strong> {home?.assurance_state}</p>
        </IdentityCard>

        <IdentityCard title={t("identity.my_memberships")}>
          {(home?.memberships ?? []).length === 0 ? (
            <p>No memberships yet.</p>
          ) : (
            <ul className="space-y-2">
              {home?.memberships?.map((m) => (
                <li key={m.institution_id} className="flex justify-between gap-2">
                  <span>{m.institution_name ?? m.institution_id} · {m.role} · {m.status}</span>
                  <Link href="/july-14" className="text-indigo-700 underline text-xs">Enter</Link>
                </li>
              ))}
            </ul>
          )}
        </IdentityCard>

        <IdentityCard title={t("identity.my_verification")}>
          <p>
            {home?.verification_progress?.qualifying ?? 0} of {home?.verification_progress?.required ?? 2} qualifying confirmations
          </p>
          <Link href="/identity/verification" className="mt-2 inline-block text-indigo-700 underline">
            {t("verification.request")}
          </Link>
        </IdentityCard>

        <IdentityCard title={t("identity.my_lineage")}>
          {home?.sponsor_lineage ? (
            <>
              <p>Invited by <strong>{home.sponsor_lineage.sponsor_public_name}</strong></p>
              <p>Institution of entry: {home.sponsor_lineage.institution_of_entry}</p>
              <p className="text-xs text-slate-500">
                Accepted: {home.sponsor_lineage.invitation_accepted_at ? new Date(home.sponsor_lineage.invitation_accepted_at).toLocaleDateString() : "—"}
              </p>
            </>
          ) : (
            <p>Founding or legacy reconciliation lineage.</p>
          )}
        </IdentityCard>

        <IdentityCard title={t("identity.my_invitations")}>
          <p>Available: {home?.invitation_privilege?.available ?? 0} · Sent: {home?.invitation_privilege?.sent ?? 0}</p>
          <Link href="/identity/invitations" className="text-indigo-700 underline">Manage invitations</Link>
        </IdentityCard>

        <IdentityCard title={t("identity.my_timeline")}>
          <ul className="max-h-40 space-y-1 overflow-auto text-xs">
            {(home?.timeline ?? []).map((ev, i) => (
              <li key={`${ev.event_type}-${i}`}>
                <span className="font-medium">{ev.event_type}</span>
                <span className="text-slate-500"> · {new Date(ev.occurred_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </IdentityCard>
      </div>
    </IdentityShell>
  );
}
