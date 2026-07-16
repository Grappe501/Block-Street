import Link from "next/link";
import { GetLoudResourceSection } from "@/components/civic-resources/GetLoudResourceSection";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


const GATES = [
  ["Campus permission", "Not started"],
  ["Legal / compliance review", "Not started"],
  ["Dates", "Planning"],
  ["Locations", "Planning"],
  ["Team lead", "Not started"],
  ["Volunteers needed", "Planning"],
  ["Volunteers committed", "Not started"],
  ["Materials ready", "Awaiting verification"],
  ["Shift coverage", "Not started"],
  ["Social media ready", "Not started"],
  ["Outreach ready", "Not started"],
  ["Follow-up plan", "Not started"],
  ["Overall readiness", "Planning"],
] as const;

const METRICS = [
  "Registration goal",
  "Registration conversations",
  "Forms distributed",
  "Registrations assisted",
  "Verified registrations",
  "Follow-up contacts",
  "VCI activity",
  "Launch-team recruitment",
] as const;

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}/voter-registration`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="First-week voter-registration drive">
      <p className="text-sm text-slate-700">
        Prepare a back-to-school registration drive during the first week students return. Plans are not campus approval or legal certification.
      </p>
      <GetLoudResourceSection variant="standard" className="mt-4" />
      <section className="mt-4 rounded-xl border bg-white p-4">
        <h2 className="font-bold">Readiness board</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {GATES.map(([label, state]) => (
            <li key={label} className="flex justify-between gap-3 border-b border-slate-100 py-1">
              <span>{label}</span>
              <span className="shrink-0 text-xs font-semibold text-amber-800">{state}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-4 rounded-xl border bg-white p-4">
        <h2 className="font-bold">Activity lanes (keep separate)</h2>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {METRICS.map((m) => (
            <li key={m} className="rounded bg-slate-50 px-2 py-1">{m}: —</li>
          ))}
        </ul>
      </section>
      <nav className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link href={`${base}/plan`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Plan workflow</Link>
        <Link href={`${base}/team`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Registration team</Link>
        <Link href={`${base}/locations`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Locations</Link>
        <Link href={`${base}/shifts`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Shifts</Link>
        <Link href={`${base}/materials`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Materials</Link>
        <Link href={`${base}/recruit`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Recruit volunteers</Link>
        <Link href={`${base}/readiness`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Readiness board</Link>
        <Link href={`/college/${college.slug}/teams/voter-registration`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Open VR Team</Link>
      </nav>
    </CollegeChrome>
  );
}
