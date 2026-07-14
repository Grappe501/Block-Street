import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


const BOARD = [
  ["Event concept", "Planning"],
  ["Possible dates", "Not started — identify three"],
  ["Possible venues", "Not started — identify three"],
  ["Expected attendance", "Estimate only"],
  ["Event lead", "Leadership conversation requested"],
  ["Planning team", "Not started"],
  ["Hospitality", "Not started"],
  ["Activities", "Not started"],
  ["Food / refreshments", "Not started"],
  ["Promotion", "Not started"],
  ["Invitations", "Soft beta"],
  ["Team showcase", "Not started"],
  ["Signup process", "Partial"],
  ["Follow-up plan", "Not started"],
  ["Overall readiness", "Planning"],
] as const;

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}/social-event`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Campus networking & recruitment event">
      <p className="text-sm text-slate-700">
        A social experience to help students meet, join the College Community, and pick a useful next step — not a long political meeting.
      </p>
      <section className="mt-4 rounded-xl border bg-white p-4">
        <h2 className="font-bold">Planning board</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {BOARD.map(([label, state]) => (
            <li key={label} className="flex justify-between gap-3 border-b border-slate-100 py-1">
              <span>{label}</span>
              <span className="shrink-0 text-xs font-semibold text-amber-800">{state}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-4 rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm">
        <p className="font-bold text-brand-950">Immediate actions</p>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-brand-950">
          <li>Identify three possible dates</li>
          <li>Identify three possible locations</li>
          <li>Name an event-planning lead or request a leadership conversation</li>
          <li>Invite five initial participants</li>
          <li>Begin a campus promotion plan</li>
        </ol>
      </section>
      <nav className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link href={`${base}/plan`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Event planning board</Link>
        <Link href={`${base}/team`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Planning team</Link>
        <Link href={`${base}/venue`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Venue options</Link>
        <Link href={`${base}/program`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Program flow</Link>
        <Link href={`${base}/promotion`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Promotion</Link>
        <Link href={`${base}/invitations`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Invitations</Link>
        <Link href={`${base}/follow-up`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Follow-up</Link>
        <Link href={`/college/${college.slug}/teams/social-events`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Social & Events Team</Link>
      </nav>
    </CollegeChrome>
  );
}
