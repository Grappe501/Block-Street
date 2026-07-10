import Link from "next/link";
import {
  getV1HighSchools,
  getRegistryStats,
  getCounties,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/data";

export default function HighSchoolsPage() {
  const schools = getV1HighSchools();
  const stats = getRegistryStats();
  const counties = getCounties();

  const byCounty = counties
    .map((c) => ({
      county: c,
      schools: schools.filter((s) => s.county === c.slug),
    }))
    .filter((g) => g.schools.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Arkansas Public High Schools</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Every public high school in every county — sourced from the Arkansas Department of Education.
        Find yours or become the organizer for a school that needs one.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <span className="badge bg-slate-100 text-slate-700">{stats.totalHighSchools} high schools</span>
        <span className="badge bg-slate-100 text-slate-700">{stats.countiesWithHighSchool}/75 counties</span>
        <span className="badge bg-red-100 text-red-800">
          {schools.filter((s) => s.representationStatus === "needs_organizer").length} need organizers
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Post-secondary schools:{" "}
        <Link href="/schools" className="text-brand-600 hover:underline">
          colleges &amp; universities →
        </Link>
        {" · "}
        Private &amp; charter:{" "}
        <Link href="/private-schools" className="text-brand-600 hover:underline">
          {stats.totalPrivateCharterSchools} statewide →
        </Link>
      </p>

      <div className="mt-10 space-y-10">
        {byCounty.map(({ county, schools: countySchools }) => (
          <section key={county.slug}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                <Link href={`/county/${county.slug}`} className="hover:text-brand-600">
                  {county.name}
                </Link>
              </h2>
              <span className="text-sm text-slate-500">{countySchools.length} schools</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {countySchools.map((school) => (
                <Link
                  key={school.slug}
                  href={`/high-schools/${school.slug}`}
                  className="card flex items-center justify-between py-3 transition hover:border-brand-300"
                  style={{ borderLeftWidth: 3, borderLeftColor: school.colors.primary }}
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate font-semibold text-slate-900">{school.name}</p>
                    <p className="text-xs text-slate-500">{school.city}</p>
                  </div>
                  <span className={`badge shrink-0 text-xs ${STATUS_COLORS[school.representationStatus]}`}>
                    {STATUS_LABELS[school.representationStatus]}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
