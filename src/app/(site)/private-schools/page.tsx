import Link from "next/link";
import {
  getV1PrivateCharterSchools,
  getRegistryStats,
  getCounties,
  STATUS_COLORS,
  STATUS_LABELS,
  getInstitutionTypeLabel,
} from "@/lib/data";

export default function PrivateSchoolsPage() {
  const schools = getV1PrivateCharterSchools();
  const stats = getRegistryStats();
  const counties = getCounties();

  const privateSchools = schools.filter((s) => s.sector === "private");
  const charterSchools = schools.filter((s) => s.sector === "charter");

  const byCounty = counties
    .map((c) => ({
      county: c,
      private: privateSchools.filter((s) => s.county === c.slug),
      charter: charterSchools.filter((s) => s.county === c.slug),
    }))
    .filter((g) => g.private.length > 0 || g.charter.length > 0);

  const SchoolList = ({ items }: { items: typeof schools }) => (
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((school) => (
        <Link
          key={school.slug}
          href={`/private-schools/${school.slug}`}
          className="card flex items-center justify-between py-3 transition hover:border-brand-300"
          style={{ borderLeftWidth: 3, borderLeftColor: school.colors.primary }}
        >
          <div className="min-w-0 pr-2">
            <p className="truncate font-semibold text-slate-900">{school.name}</p>
            <p className="text-xs text-slate-500">
              {getInstitutionTypeLabel(school.type)} · {school.city} · Grades {school.grades}
            </p>
          </div>
          <span className={`badge shrink-0 text-xs ${STATUS_COLORS[school.representationStatus]}`}>
            {STATUS_LABELS[school.representationStatus]}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Arkansas Private &amp; Charter Schools</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Every private school and charter school in Arkansas — sourced from the Arkansas Department of Education.
        Find yours or become the organizer for a school that needs one.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <span className="badge bg-violet-100 text-violet-800">{stats.totalPrivateSchools} private schools</span>
        <span className="badge bg-emerald-100 text-emerald-800">{stats.totalCharterSchools} charter schools</span>
        <span className="badge bg-slate-100 text-slate-700">{stats.countiesWithPrivateOrCharter}/75 counties with schools</span>
        <span className="badge bg-red-100 text-red-800">
          {schools.filter((s) => s.representationStatus === "needs_organizer").length} need organizers
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Public high schools:{" "}
        <Link href="/high-schools" className="text-brand-600 hover:underline">
          {stats.totalHighSchools} statewide →
        </Link>
        {" · "}
        Post-secondary:{" "}
        <Link href="/schools" className="text-brand-600 hover:underline">
          colleges &amp; universities →
        </Link>
      </p>

      <div className="mt-10 space-y-10">
        {byCounty.map(({ county, private: countyPrivate, charter: countyCharter }) => (
          <section key={county.slug}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                <Link href={`/county/${county.slug}`} className="hover:text-brand-600">
                  {county.name}
                </Link>
              </h2>
              <span className="text-sm text-slate-500">
                {countyPrivate.length} private · {countyCharter.length} charter
              </span>
            </div>
            {countyPrivate.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-700">Private</h3>
                <SchoolList items={countyPrivate} />
              </div>
            )}
            {countyCharter.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Charter</h3>
                <SchoolList items={countyCharter} />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
