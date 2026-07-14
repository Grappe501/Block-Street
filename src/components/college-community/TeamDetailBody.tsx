import Link from "next/link";
import type { CampusTeam } from "@/lib/college-community/catalog";
import { listPositionsForTeam } from "@/lib/college-community/catalog";
import { listCommandLanes } from "@/lib/command/board";

export function TeamDetailBody({
  team,
  slug,
}: {
  team: CampusTeam;
  slug: string;
}) {
  const base = `/college/${slug}`;
  const positions = listPositionsForTeam(team.id);
  const lane = listCommandLanes().find((l) => l.campus_team_id === team.id);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-field-ink/15 bg-white p-5 shadow-sm">
        <h2 className="font-fieldDisplay text-xl text-field-ink">{team.name}</h2>
        <p className="mt-2 text-sm text-field-ink/80">{team.purpose}</p>
        <p className="mt-3 text-sm text-field-ink">
          <span className="font-semibold">Why it matters:</span> {team.whyItMatters}
        </p>
        <p className="mt-2 text-sm text-field-ink">
          <span className="font-semibold">Current goal:</span> {team.currentGoal}
        </p>
        <div className="mt-4 rounded-lg bg-field-dusk p-3 text-sm font-semibold text-field-wheat">
          First task: {team.immediateAction}
        </div>
        {lane ? (
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href={`/command/campus/${slug}/${lane.id}`} className="text-field-pine underline">
              Campus {lane.label} board
            </Link>
            <Link href={`/command/campaign/${lane.id}`} className="text-field-pine underline">
              Campaign {lane.label} board
            </Link>
            {lane.under_events_board ? (
              <Link href="/command/events" className="text-field-pine underline">
                Event Board (Carol Eagan)
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-bold">First-week responsibilities</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {team.firstWeek.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-bold">First-month rhythm</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {team.firstMonth.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Related event work:</span> {team.relatedEvent}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Related voter-registration work:</span> {team.relatedVr}
        </p>
      </section>

      <section>
        <h3 className="font-bold">Open leadership & volunteer roles</h3>
        <ul className="mt-3 space-y-2">
          {positions.map((p) => (
            <li key={p.id}>
              <Link
                href={`${base}/positions/${p.id}`}
                className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400"
              >
                <p className="font-semibold">
                  {p.title}{" "}
                  <span className="text-xs font-medium text-slate-500">({p.kind})</span>
                </p>
                <p className="text-xs text-slate-600">{p.firstTask}</p>
              </Link>
            </li>
          ))}
        </ul>
        {positions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Additional roles coming — express general team interest below.</p>
        ) : null}
      </section>

      <section className="flex flex-wrap gap-2">
        <Link href={`${base}/people`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">
          Express interest in this team
        </Link>
        <Link href={`${base}/recruit`} className="rounded-lg border px-3 py-2 text-xs font-semibold">
          Invite people to this team
        </Link>
        <Link href={base} className="rounded-lg border px-3 py-2 text-xs font-semibold">
          Return to College Community
        </Link>
      </section>
    </div>
  );
}
