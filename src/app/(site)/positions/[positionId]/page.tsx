import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { listCommandLanes } from "@/lib/command/board";
import { getCollegePosition, withMeetingReturn } from "@/lib/meeting/positions-catalog";

function laneForPosition(positionId: string) {
  return listCommandLanes().find((l) => l.meeting_position_id === positionId) ?? null;
}

export function generateStaticParams() {
  return [
    { positionId: "college-social-media-lead" },
    { positionId: "college-voter-registration-lead" },
    { positionId: "college-community-lead" },
    { positionId: "college-event-lead" },
    { positionId: "college-canvass-outreach-lead" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ positionId: string }> }) {
  const { positionId } = await params;
  const position = getCollegePosition(positionId);
  return { title: position ? `${position.title} — soft beta` : "Position" };
}

export default async function PositionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ positionId: string }>;
  searchParams: Promise<{ from?: string; item?: string }>;
}) {
  const { positionId } = await params;
  const { from, item } = await searchParams;
  const position = getCollegePosition(positionId);
  if (!position) notFound();

  const interestHref = withMeetingReturn(`/join/interest?position=${position.id}`, from, item);
  const lane = laneForPosition(position.id);

  return (
    <Suspense fallback={null}>
      <MeetingChrome
        title={position.title}
        subtitle={position.primaryContribution}
        eyebrow={`${position.command} · ${position.status} · soft beta`}
      >
        <p className="mb-6 text-sm">
          <Link href="/positions/college" className="font-semibold text-field-pine underline-offset-2 hover:underline">
            ← College Team
          </Link>
        </p>

        {lane ? (
          <section className="mb-8 rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-field-pine">Leader boards</p>
            <p className="mt-2 text-sm text-field-ink/80">
              This seat sits on the <strong>{lane.label}</strong> lane. Campus leaders on the same lane connect to the
              campaign board. CM and ACM oversee both sides
              {lane.under_events_board ? "; Event Board is under Volunteer Manager Carol Eagan" : ""}.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href={`/command/campaign/${lane.id}`} className="text-field-pine underline">
                Campaign board
              </Link>
              <Link href="/command/campus" className="text-field-pine underline">
                Campus boards
              </Link>
              {lane.under_events_board ? (
                <Link href="/command/events" className="text-field-pine underline">
                  Event Board
                </Link>
              ) : null}
              <Link href="/command/managers" className="text-field-pine underline">
                CM / ACM
              </Link>
            </div>
          </section>
        ) : null}

        <section className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-950">Purpose:</span> {position.primaryContribution}
          </p>
          <p>
            <span className="font-semibold text-slate-950">Serves:</span> {position.serves}
          </p>
          <p>
            <span className="font-semibold text-slate-950">Reporting:</span> {position.reportsTo}
          </p>
          <p>
            <span className="font-semibold text-slate-950">Time expectation:</span> {position.timeExpectation}
          </p>
        </section>

        <section id="responsibilities" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">Responsibilities</h2>
          <p className="mt-1 text-xs text-slate-500">Provisional from agenda role meaning — not Field Plan doctrine.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {position.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <section id="success" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">Success (provisional KPIs)</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {position.kpis.map((k) => (
              <li key={k.label}>
                {k.provisional ? "(Provisional) " : ""}
                {k.label}
              </li>
            ))}
          </ul>
        </section>

        <section id="first-meeting" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">First meeting</h2>
          <p className="mt-2 text-sm text-slate-700">
            Arrive ready to welcome peers, share how this seat helps campus organize, and leave with a next step — interest,
            invite prep, or a Power of 5 seat. No fabricated appointments tonight.
          </p>
        </section>

        <section id="first-24-hours" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">First 24 hours</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {position.first24Hours.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <section id="first-7-days" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">First 7 days</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {position.first7Days.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <section id="first-30-days" className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">First 30 days</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {position.first30Days.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-950">Tools that help today</h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold">
            <li>
              <Link
                href={withMeetingReturn("/power-of-5", from, item)}
                className="text-brand-800 underline-offset-2 hover:underline"
              >
                Power of 5 →
              </Link>
            </li>
            <li>
              <Link
                href={withMeetingReturn("/recruit", from, item)}
                className="text-brand-800 underline-offset-2 hover:underline"
              >
                Recruit guide →
              </Link>
            </li>
            <li>
              <Link
                href={withMeetingReturn("/field-plan", from, item)}
                className="text-brand-800 underline-offset-2 hover:underline"
              >
                Field Plan library →
              </Link>
            </li>
            <li>
              <Link href={interestHref} className="text-brand-800 underline-offset-2 hover:underline">
                Express interest in this seat →
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <p className="font-semibold text-slate-950">Enabled today</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-700">
              {position.enabledToday.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <p className="font-semibold text-slate-950">Pending</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-700">
              {position.pending.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={interestHref}
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            I&apos;m interested
          </Link>
          <Link
            href={withMeetingReturn(`/join/position/${position.id}`, from, item)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
          >
            Join via this seat
          </Link>
        </div>

        <div className="mt-8">
          <HonestyPanel workingNow={position.enabledToday} stillCompleting={position.pending} />
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Nested views:{" "}
          <Link href={`/positions/${position.id}/responsibilities`} className="underline">
            responsibilities
          </Link>
          {" · "}
          <Link href={`/positions/${position.id}/first-24-hours`} className="underline">
            first 24 hours
          </Link>
          {" · "}
          <Link href={`/positions/${position.id}/first-7-days`} className="underline">
            first 7 days
          </Link>
          {" · "}
          <Link href={`/positions/${position.id}/first-30-days`} className="underline">
            first 30 days
          </Link>
          {" · "}
          <Link href={`/positions/${position.id}/team`} className="underline">
            team
          </Link>
          {" · "}
          <Link href={`/positions/${position.id}/field-plan`} className="underline">
            field plan
          </Link>
        </p>
      </MeetingChrome>
    </Suspense>
  );
}
