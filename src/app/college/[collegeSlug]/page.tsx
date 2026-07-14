import Link from "next/link";
import { notFound } from "next/navigation";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { CAMPUS_TEAMS, MONTH_PLAN } from "@/lib/college-community/catalog";
import { getCollege, listColleges } from "@/lib/college-community/institutions";

export function generateStaticParams() {
  return listColleges().map((c) => ({ collegeSlug: c.slug }));
}

export default async function CollegeCommunityHomePage({
  params,
}: {
  params: Promise<{ collegeSlug: string }>;
}) {
  const { collegeSlug } = await params;
  const college = getCollege(collegeSlug);
  if (!college) notFound();
  const base = `/college/${college.slug}`;

  return (
    <CollegeChrome slug={college.slug} name={college.name}>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Welcome to the {college.shortName} College Community</h2>
        <p className="mt-2 text-sm text-slate-700">
          {college.city}, {college.county} County · Soft beta. Join to grow this campus together — you do not need to wait
          for someone else to begin.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`${base}/people`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">
            Join this College Community
          </Link>
          <Link href={`${base}/people`} className="rounded-lg border px-3 py-2 text-xs font-semibold">
            Follow / explore
          </Link>
          <Link href={`${base}/recruit`} className="rounded-lg border px-3 py-2 text-xs font-semibold">
            Invite someone from this school
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border-2 border-brand-600 bg-brand-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-800">My next step</p>
        <p className="mt-1 font-semibold text-brand-950">
          Invite five people you already know at {college.shortName}, then explore one campus team.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`${base}/power-of-5`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">
            Bring five people
          </Link>
          <Link href={`${base}/teams`} className="rounded-lg border border-brand-700 px-3 py-2 text-xs font-bold text-brand-900">
            Browse teams
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">Our next 30 days</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {Object.entries(MONTH_PLAN).map(([key, week]) => (
            <Link key={key} href={`${base}/plan/${key.replace("week", "week-")}`} className="rounded-xl border bg-white p-4 hover:border-brand-400">
              <p className="text-sm font-bold">{week.title}</p>
              <p className="mt-1 text-xs text-slate-600">{week.items[0]}</p>
            </Link>
          ))}
        </div>
        <Link href={`${base}/plan`} className="mt-2 inline-block text-sm font-semibold text-brand-700 underline">
          Open full plan →
        </Link>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href={`${base}/voter-registration`} className="rounded-xl border bg-white p-4 hover:border-brand-400">
          <p className="text-xs font-bold text-brand-700">First-week voter-registration drive</p>
          <p className="mt-1 text-sm text-slate-700">Readiness board, locations, shifts, materials — no false compliance claims.</p>
        </Link>
        <Link href={`${base}/social-event`} className="rounded-xl border bg-white p-4 hover:border-brand-400">
          <p className="text-xs font-bold text-brand-700">Campus networking event</p>
          <p className="mt-1 text-sm text-slate-700">Social recruitment experience — dates, venues, hospitality, follow-up.</p>
        </Link>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">Campus teams</h2>
        <ul className="mt-3 space-y-2">
          {CAMPUS_TEAMS.map((t) => (
            <li key={t.id}>
              <Link href={`${base}/teams/${t.id}`} className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-slate-600">{t.immediateAction}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`${base}/positions`} className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">
          People we need — open positions →
        </Link>
      </section>
    </CollegeChrome>
  );
}
