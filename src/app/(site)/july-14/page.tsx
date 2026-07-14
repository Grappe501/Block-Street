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
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Tonight · 6:00 PM</p>
        <h2 id="launch-agenda-heading" className="mt-1 text-2xl font-bold text-slate-900">
          Meeting Agenda: Launching ASYON
        </h2>
        <p className="mt-1 text-sm text-slate-600">Duration: 30–45 minutes</p>
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-950">
          Goal: Introduce the organization, rally participants, and assign roles to build collective power.
        </p>

        <ol className="mt-6 space-y-6 text-sm text-slate-800">
          <li>
            <h3 className="text-base font-bold text-slate-900">1. Introductions</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong>Chance and Xay (Youth Leaders):</strong> Share vision, experience, and passion for organizing young
                people in politics.
              </li>
              <li>
                <strong>Politician Guests:</strong> Briefly introduce them and their role in supporting this effort.
              </li>
              <li>
                <strong>Quick Name and School:</strong> Each participant introduces themselves with their name &amp; school
                (e.g., “Alex, University of Arkansas”).
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">2. Why This Matters</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">The Urgency</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    We’re at a perfect political cusp. The next elections (2026–2028) have the capability to be decided by
                    young voters. If we organize now, we can influence every seat in the state.
                  </li>
                  <li>
                    Steve (Overall Organizer) has never seen Arkansas colleges organize like this before. This is our chance
                    to make history.
                  </li>
                  <li>
                    You are the most valuable thing to politicians. Young voters are the largest and most untapped voting
                    bloc by large margin. Politicians need us to win, but we need to organize to demand power in return.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">The Problem</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    More than 50% of the voting population is under 50, but the rules are still made by those over 50. We
                    have the numbers but not the organization to aid ourselves, <em>yet</em>.
                  </li>
                  <li>
                    Ballot initiatives and lawmaking are areas where young people can have a massive impact—if we’re united.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">The Opportunity</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    Swinging the election for people like Kelly, people like Chris, or whoever we decide has our intentions
                    best in mind. This isn’t about a single candidate. It’s about building team voting power to amplify our
                    voice and demand change.
                  </li>
                  <li>After the election, we can uplift each other and future leaders to run for office in the coming years.</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">3. How This Works</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">Our Approach</p>
                <p className="mt-1 pl-0">
                  Every campus or group will be unique. We’re providing resources and support, but every group will shape
                  this to fit their community.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Core Roles Needed on Every Campus</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>Social Media Lead (to grow our network and spread the word)</li>
                  <li>Voter Registration Lead (to ensure our peers are registered and ready to vote)</li>
                  <li>College/Community Lead (to oversee and coordinate efforts locally)</li>
                  <li>Event Lead (to organize fun, engaging, and informative events)</li>
                  <li>Canvassing/Outreach Lead (to connect with peers and expand our network)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Why Now?</p>
                <p className="mt-1">
                  Summer is the best time to organize. Life is less chaotic with school out so we can build momentum before
                  the fall rush. Grinding this next month is <strong>essential</strong>.
                </p>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">4. What We’re Building</h3>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">Our Vision</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>
                    A social network across the state of young people (16–24) to get engaged, inform their peers, and
                    establish political power.
                  </li>
                  <li>Making politics fun</li>
                  <li>The Power of 5</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Long-Term Goals</p>
                <ul className="mt-1 list-disc space-y-1.5 pl-5">
                  <li>Set a foundation for organizing young people to run for office in future elections.</li>
                  <li>Build soft power to influence local politics and politicians.</li>
                  <li>Ballot initiatives and lawmaking — areas where we can have massive effect.</li>
                  <li>Create a statewide network that prepares young leaders to take on leadership roles everywhere.</li>
                  <li>Build collective power so we can change the government together.</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">5. Show Them How to Use the Website</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Walk through the website’s features</li>
              <li>Highlight how they can access materials, training, and support to get started</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/start" className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800">
                Start / invite
              </Link>
              <Link href="/choose-place" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                Choose place
              </Link>
              <Link href="/network" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                My Network
              </Link>
              <Link href="/directory" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400">
                Directory
              </Link>
            </div>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">6. Next Steps: Meeting Again</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Tell us what dates you <strong>can’t</strong> make, and we’ll pick the widest availability.</li>
              <li>
                Proposed window: <strong>July 20–26</strong>
              </li>
            </ul>
          </li>

          <li>
            <h3 className="text-base font-bold text-slate-900">7. Name Decision for the Organization</h3>
            <p className="mt-2 text-slate-700">Optional, if time allows — open the floor to brainstorm names for the organization.</p>
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
