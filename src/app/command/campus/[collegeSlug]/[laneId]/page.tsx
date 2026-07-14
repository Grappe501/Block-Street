import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { buildLaneBoard, listCommandLanes } from "@/lib/command/board";
import { getCollege, listColleges } from "@/lib/college-community/institutions";

export const dynamicParams = true;

export function generateStaticParams() {
  const first = listColleges()[0];
  if (!first) return [];
  return listCommandLanes().map((l) => ({ collegeSlug: first.slug, laneId: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collegeSlug: string; laneId: string }>;
}) {
  const { collegeSlug, laneId } = await params;
  const college = getCollege(collegeSlug);
  const board = buildLaneBoard(laneId, collegeSlug);
  return {
    title: college && board ? `${college.name} · ${board.lane.label}` : "Campus lane",
  };
}

export default async function CampusLanePage({
  params,
}: {
  params: Promise<{ collegeSlug: string; laneId: string }>;
}) {
  const { collegeSlug, laneId } = await params;
  const college = getCollege(collegeSlug);
  const board = buildLaneBoard(laneId, collegeSlug);
  if (!college || !board) notFound();

  const { lane, meeting, team, campusPositions, oversight } = board;

  return (
    <CommandChrome
      title={`${lane.label} · ${college.name}`}
      subtitle="Campus lane board linked to the matching campaign board. Independent college pages stay local."
      backHref={`/command/campus/${college.slug}`}
      backLabel={college.name}
      eyebrow="Campus lane · soft beta"
    >
      <div className="rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-pine">Bridge</p>
        <p className="mt-2 font-fieldSans text-sm text-field-ink">
          Campus <strong>{team?.name}</strong> ↔ Campaign <strong>{lane.label}</strong> board
        </p>
        <p className="mt-2 font-fieldSans text-sm text-field-ink/75">
          Overseen by {oversight.campaign_manager.display_name} and{" "}
          {oversight.assistant_campaign_manager.display_name}.
          {lane.under_events_board
            ? ` Event Board owned by ${oversight.volunteer_manager.person}.`
            : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={board.campaignHref}
            className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-xs font-bold text-field-wheat"
          >
            Open campaign board
          </Link>
          {lane.under_events_board ? (
            <Link
              href="/command/events"
              className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
            >
              Event Board
            </Link>
          ) : null}
          <Link
            href={`/college/${college.slug}/teams/${lane.campus_team_id}`}
            className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
          >
            Campus team page
          </Link>
        </div>
      </div>

      <CommandSection title="Campus seats on this lane">
        <ul className="space-y-2">
          {campusPositions.map((p) => (
            <li key={p.id} className="rounded-xl border border-field-ink/15 bg-white px-4 py-3">
              <p className="font-fieldSans text-sm font-bold text-field-ink">{p.title}</p>
              <p className="mt-1 font-fieldSans text-sm text-field-ink/70">{p.purpose}</p>
              <Link
                href={`/college/${college.slug}/positions/${p.id}`}
                className="mt-2 inline-block font-fieldSans text-xs font-semibold text-field-pine underline"
              >
                Open position
              </Link>
            </li>
          ))}
        </ul>
      </CommandSection>

      <CommandSection title="College Team job (meeting seat)">
        <CommandCard
          href={lane.signup_href}
          title={`Sign up — ${meeting?.title ?? "role"}`}
          note="Soft-beta interest · not an appointment"
          accent
        />
        <CommandCard href={lane.position_href} title="Full role page" note={meeting?.primaryContribution} />
      </CommandSection>
    </CommandChrome>
  );
}
