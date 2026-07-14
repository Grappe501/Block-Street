"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdentityShell } from "@/components/identity/IdentityShell";
import { ModeBadge } from "@/components/identity/ModeBadge";
import { LockedFeature } from "@/components/identity/ModeBadge";
import { useIdentityLocale } from "@/components/identity/LanguageToggle";
import type { ImplementationMode } from "@/lib/july14/config";

export default function July14MeetingPage() {
  const { t } = useIdentityLocale();
  const [ctx, setCtx] = useState<Record<string, unknown> | null>(null);
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/july14/home?mode=meeting")
      .then((r) => r.json())
      .then((d) => setCtx(d.data ?? d))
      .catch(() => fetch("/api/v1/july14/status").then((r) => r.json()).then((d) => setCtx({ meeting: d.data?.meeting, system_status: d.data?.system_status })));
  }, []);

  const meeting = ctx?.meeting as Record<string, unknown> | undefined;
  const human = ctx?.human as Record<string, unknown> | undefined;
  const journey = (ctx?.demonstration_journey as { q: string; a: string }[]) ?? [];
  const systemStatus = (ctx?.system_status as { name: string; mode: ImplementationMode; note?: string }[]) ?? [];

  function submitForm(type: "feedback" | "question") {
    setSubmitted(type === "feedback" ? "Thank you — our feedback was recorded." : "Our question was submitted to meeting hosts.");
  }

  return (
    <IdentityShell title={t("join.july14_entry")} subtitle={String(meeting?.title ?? "July 14 Organizing Platform Launch")} showSwitcher>
      <section
        className="rounded-xl border-2 border-brand-600 bg-white p-5 shadow-sm sm:p-6"
        aria-labelledby="launch-agenda-heading"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{t("agenda.tonight")}</p>
        <h2 id="launch-agenda-heading" className="mt-1 text-2xl font-bold text-slate-900">
          {t("agenda.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t("agenda.duration")}</p>
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-950">{t("agenda.goal")}</p>

        <ol className="mt-6 space-y-6 text-sm text-slate-800">
          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s1.title")}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{t("agenda.s1.a")}</li>
              <li>{t("agenda.s1.b")}</li>
              <li>{t("agenda.s1.c")}</li>
            </ul>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s2.title")}</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s2.urgency")}</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>{t("agenda.s2.urgency.a")}</li>
                  <li>{t("agenda.s2.urgency.b")}</li>
                  <li>{t("agenda.s2.urgency.c")}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s2.problem")}</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>{t("agenda.s2.problem.a")}</li>
                  <li>{t("agenda.s2.problem.b")}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s2.opportunity")}</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>{t("agenda.s2.opportunity.a")}</li>
                  <li>{t("agenda.s2.opportunity.b")}</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s3.title")}</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s3.approach")}</p>
                <p className="mt-1">{t("agenda.s3.approach.body")}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s3.roles")}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>{t("agenda.s3.roles.a")}</li>
                  <li>{t("agenda.s3.roles.b")}</li>
                  <li>{t("agenda.s3.roles.c")}</li>
                  <li>{t("agenda.s3.roles.d")}</li>
                  <li>{t("agenda.s3.roles.e")}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s3.why")}</p>
                <p className="mt-1">{t("agenda.s3.why.body")}</p>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s4.title")}</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s4.vision")}</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>{t("agenda.s4.vision.a")}</li>
                  <li>{t("agenda.s4.vision.b")}</li>
                  <li>{t("agenda.s4.vision.c")}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t("agenda.s4.long")}</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>{t("agenda.s4.long.a")}</li>
                  <li>{t("agenda.s4.long.b")}</li>
                  <li>{t("agenda.s4.long.c")}</li>
                  <li>{t("agenda.s4.long.d")}</li>
                  <li>{t("agenda.s4.long.e")}</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s5.title")}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{t("agenda.s5.a")}</li>
              <li>{t("agenda.s5.b")}</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/start" className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800">
                {t("agenda.s5.start")}
              </Link>
              <Link href="/choose-place" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                {t("agenda.s5.place")}
              </Link>
              <Link href="/network" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                {t("agenda.s5.network")}
              </Link>
              <Link href="/directory" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                {t("agenda.s5.directory")}
              </Link>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s6.title")}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{t("agenda.s6.a")}</li>
              <li>{t("agenda.s6.b")}</li>
            </ul>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">{t("agenda.s7.title")}</h3>
            <p className="mt-2 text-slate-700">{t("agenda.s7.body")}</p>
          </li>
        </ol>
      </section>

      {human && (
        <div className="rounded border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-lg font-bold text-indigo-950">
            {t("july14.welcome")}, {String(human.public_name)}
          </p>
          <p className="text-sm text-indigo-900">
            {t("july14.entering_as")} <strong>{String(human.public_badge ?? human.assurance_state)}</strong> in{" "}
            <strong>{String(ctx?.institution_name ?? "our institution")}</strong>.
          </p>
          <p className="mt-1 text-xs text-indigo-800">Global Human ID: {String(human.global_human_id_masked ?? human.global_human_id)}</p>
        </div>
      )}

      {meeting && (
        <section className="rounded border p-4" aria-labelledby="meeting-heading">
          <h2 id="meeting-heading" className="font-bold text-slate-900">{t("july14.meeting")}</h2>
          <p className="text-sm font-medium">{String(meeting.title)}</p>
          <p className="text-xs text-slate-600">
            {String(meeting.date)} · {String(meeting.time)} · Host: {String(meeting.host)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{String(meeting.participant_count)} participants</p>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-700">
            {((meeting.agenda as string[]) ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href="/identity" className="mt-3 inline-block rounded bg-indigo-700 px-4 py-2 text-sm text-white">
            Enter meeting workspace
          </Link>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2" aria-label="My identity summary">
        <div className="rounded border p-3 text-sm">
          <p className="font-semibold">My Identity</p>
          <p>{human ? String(human.assurance_state) : "—"}</p>
          <p className="text-xs text-slate-600">{human ? String(human.assurance_explanation) : ""}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <p className="font-semibold">Sponsor lineage</p>
          <p>{(human?.sponsor_lineage as { sponsor_public_name?: string })?.sponsor_public_name ?? "Founding path"}</p>
        </div>
      </section>

      <section className="space-y-2" aria-labelledby="journey-heading">
        <h2 id="journey-heading" className="font-bold text-slate-900">Live demonstration journey</h2>
        {journey.map((item) => (
          <details key={item.q} className="rounded border p-3 text-sm">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 text-slate-600">{item.a}</p>
          </details>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <form
          onSubmit={(e) => { e.preventDefault(); submitForm("question"); }}
          className="rounded border p-3 text-sm"
        >
          <label className="block font-medium">
            Ask a question
            <textarea className="mt-1 w-full rounded border px-2 py-1" rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </label>
          <button type="submit" className="mt-2 rounded bg-slate-800 px-3 py-2 text-xs text-white">Submit</button>
        </form>
        <form
          onSubmit={(e) => { e.preventDefault(); submitForm("feedback"); }}
          className="rounded border p-3 text-sm"
        >
          <label className="block font-medium">
            Submit feedback
            <textarea className="mt-1 w-full rounded border px-2 py-1" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </label>
          <button type="submit" className="mt-2 rounded bg-slate-800 px-3 py-2 text-xs text-white">Submit</button>
        </form>
      </section>
      {submitted && <p className="text-sm text-emerald-800" role="status">{submitted}</p>}

      <section aria-labelledby="status-heading">
        <h2 id="status-heading" className="mb-2 font-bold text-slate-900">Meeting-safe status</h2>
        <ul className="space-y-2">
          {systemStatus.map((s) => (
            <li key={s.name} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
              <span>{s.name}</span>
              <ModeBadge mode={s.mode} note={s.note} />
            </li>
          ))}
        </ul>
      </section>

      <LockedFeature
        title="Identity Intelligence"
        reason="Automatic fraud conclusions and network-intelligence enforcement remain locked until Wave 5 is certified."
      />

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/identity" className="text-indigo-700 underline">Identity Home</Link>
        <Link href="/identity/verification" className="text-indigo-700 underline">Verification</Link>
        <Link href="/admin/identity/audit" className="text-indigo-700 underline">Audit lineage</Link>
        <Link href="/identity/sponsor" className="text-indigo-700 underline">Sponsor dashboard</Link>
      </div>
    </IdentityShell>
  );
}
