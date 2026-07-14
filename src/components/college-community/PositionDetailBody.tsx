import Link from "next/link";
import type { CampusPosition } from "@/lib/college-community/catalog";
import { getCampusTeam } from "@/lib/college-community/catalog";
import { listCommandLanes } from "@/lib/command/board";

export function PositionDetailBody({
  position,
  slug,
}: {
  position: CampusPosition;
  slug: string;
}) {
  const base = `/college/${slug}`;
  const team = getCampusTeam(position.teamId);
  const lane = listCommandLanes().find((l) => l.campus_team_id === position.teamId);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
          {position.kind === "leadership" ? "Leadership" : "Volunteer"} · Soft beta
        </p>
        <h2 className="mt-1 text-2xl font-bold">{position.title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Team:{" "}
          <Link href={`${base}/teams/${position.teamId}`} className="font-semibold text-brand-700 underline">
            {team?.name ?? position.teamId}
          </Link>
        </p>
        <p className="mt-3 text-sm text-field-ink/80">{position.purpose}</p>
        {lane ? (
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href={`/command/campus/${slug}/${lane.id}`} className="text-field-pine underline">
              Lane board
            </Link>
            <Link href={`/command/campaign/${lane.id}`} className="text-field-pine underline">
              Campaign board
            </Link>
            <Link href={lane.signup_href} className="text-field-pine underline">
              Sign up (College Team seat)
            </Link>
          </div>
        ) : null}
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Who it serves</dt>
            <dd className="text-slate-700">{position.serves}</dd>
          </div>
          <div>
            <dt className="font-semibold">Who supports you</dt>
            <dd className="text-slate-700">{position.reportsTo}</dd>
          </div>
          <div>
            <dt className="font-semibold">Time commitment</dt>
            <dd className="text-slate-700">{position.timeCommitment}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-bold">Responsibilities</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {position.responsibilities.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg bg-brand-50 p-3 text-sm font-semibold text-brand-950">
          First task: {position.firstTask}
        </div>
      </section>

      {(
        [
          ["First meeting", position.firstMeeting],
          ["First 24 hours", position.first24Hours],
          ["First seven days", position.first7Days],
          ["First 30 days", position.first30Days],
          ["What success looks like", position.success],
        ] as const
      ).map(([label, items]) => (
        <section key={label} className="rounded-xl border bg-white p-4">
          <h3 className="font-bold">{label}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-bold">Tools available now</h3>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {position.enabledToday.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-amber-50 p-4">
          <h3 className="font-bold text-amber-950">Tools still pending</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-950">
            {position.pending.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 text-sm">
        <p className="font-semibold">How this role uses a Power of 5</p>
        <p className="mt-1 text-slate-700">
          Identify five people at this school who could help this team — friends, classmates, org members, or campus
          supporters — and invite them into the College Community. Soft-beta invitation prepared ≠ certified appointment.
        </p>
        <Link href={`${base}/power-of-5`} className="mt-2 inline-block font-semibold text-brand-700 underline">
          Open campus Power of 5 →
        </Link>
      </section>

      <section className="flex flex-wrap gap-2">
        <Link href={`${base}/people`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">
          Express interest (not appointment)
        </Link>
        <Link href={`${base}/recruit`} className="rounded-lg border px-3 py-2 text-xs font-semibold">
          Invite someone else to this role
        </Link>
        <Link href={base} className="rounded-lg border px-3 py-2 text-xs font-semibold">
          Return to College Community
        </Link>
      </section>
    </div>
  );
}
