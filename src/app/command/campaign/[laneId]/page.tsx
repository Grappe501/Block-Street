import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { buildLaneBoard, listCommandLanes } from "@/lib/command/board";

export function generateStaticParams() {
  return listCommandLanes().map((l) => ({ laneId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ laneId: string }> }) {
  const { laneId } = await params;
  const board = buildLaneBoard(laneId);
  return { title: board ? `${board.lane.label} · campaign board` : "Lane board" };
}

export default async function CampaignLanePage({ params }: { params: Promise<{ laneId: string }> }) {
  const { laneId } = await params;
  const board = buildLaneBoard(laneId);
  if (!board) notFound();

  const { lane, meeting, team, campusPositions, oversight } = board;

  return (
    <CommandChrome
      title={`${lane.label} — campaign board`}
      subtitle={lane.goal}
      eyebrow="Campaign lane · soft beta"
      backHref="/command/campaign"
      backLabel="All campaign boards"
    >
      <div className="rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-pine">Oversight</p>
        <p className="mt-2 font-fieldSans text-sm text-field-ink">
          {oversight.campaign_manager.display_name} + {oversight.assistant_campaign_manager.display_name} oversee this
          board and matching campus boards.
        </p>
        {lane.under_events_board ? (
          <p className="mt-2 font-fieldSans text-sm font-semibold text-field-ink">
            Event Board owner: {oversight.volunteer_manager.person} ({oversight.volunteer_manager.display_name})
          </p>
        ) : null}
      </div>

      <CommandSection title="Campaign seat">
        <div className="rounded-xl border border-field-ink/15 bg-white p-4">
          <p className="font-fieldSans text-lg font-bold text-field-ink">{meeting?.title ?? lane.meeting_position_id}</p>
          <p className="mt-1 font-fieldSans text-sm text-field-ink/75">{meeting?.primaryContribution}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={lane.position_href}
              className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-xs font-bold text-field-wheat"
            >
              Role page
            </Link>
            <Link
              href={lane.signup_href}
              className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
            >
              Sign up for this job
            </Link>
            {lane.under_events_board ? (
              <Link
                href="/command/events"
                className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
              >
                Event Board
              </Link>
            ) : null}
          </div>
        </div>
      </CommandSection>

      <CommandSection title="Same-lane campus team">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Campus leaders on <strong className="text-field-ink">{team?.name ?? lane.campus_team_id}</strong> connect to
          this campaign board. Each college still has its own pages.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/80">
          {campusPositions.map((p) => (
            <li key={p.id}>
              {p.title} <span className="text-field-ink/55">({p.kind})</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <CommandCard href="/command/campus" title="Open a campus board" note="Pick a college → same lane" />
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
