import Link from "next/link";
import {
  getCounties,
  getInstitutionsByCounty,
  getRegistryStats,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/data";

export default function MapPage() {
  const counties = getCounties();
  const stats = getRegistryStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Arkansas Organizing Map</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        75 counties. {stats.v1Institutions} colleges and universities. Fill the map — build every campus, reach every county.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Counties", value: stats.totalCounties },
          { label: "Schools", value: stats.v1Institutions },
          { label: "Need Organizers", value: stats.needsOrganizer },
          { label: "Building", value: stats.building },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-brand-600">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-semibold text-slate-700">
        Interactive SVG map coming in next build step. Click any county below:
      </p>

      <div className="mt-4 grid gap-3">
        {counties.map((county) => {
          const schools = getInstitutionsByCounty(county.slug);
          return (
            <Link
              key={county.slug}
              href={`/county/${county.slug}`}
              className="card flex flex-col gap-2 transition hover:border-brand-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{county.name}</p>
                <p className="text-sm text-slate-500">
                  {schools.length > 0
                    ? `${schools.length} school${schools.length !== 1 ? "s" : ""}: ${schools.map((s) => s.shortName).join(", ")}`
                    : "County youth hub — no schools listed yet"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {schools.map((s) => (
                  <span key={s.slug} className={`badge text-xs ${STATUS_COLORS[s.representationStatus]}`}>
                    {s.shortName}
                  </span>
                ))}
                {schools.length === 0 && (
                  <span className="badge bg-slate-100 text-slate-600">Youth Hub</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
