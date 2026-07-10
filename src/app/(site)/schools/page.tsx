import Link from "next/link";
import {
  getV1Institutions,
  getRegistryStats,
  getInstitutionTypeLabel,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/data";

export default function SchoolsPage() {
  const schools = getV1Institutions();
  const stats = getRegistryStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Arkansas Post-Secondary Schools</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Universities, colleges, community colleges, technical institutes, and trade schools — every campus has equal standing.
        Find yours or become the organizer for a school that needs one.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <span className="badge bg-slate-100 text-slate-700">{schools.length} post-secondary schools</span>
        <span className="badge bg-slate-100 text-slate-700">{stats.countiesWithLocalCampus} counties with a local campus</span>
        <span className="badge bg-red-100 text-red-800">
          {schools.filter((s) => s.representationStatus === "needs_organizer").length} need organizers
        </span>
        <span className="badge bg-amber-100 text-amber-800">
          {schools.filter((s) => s.representationStatus === "building").length} building
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        <Link href="/high-schools" className="text-brand-600 hover:underline">
          {stats.totalHighSchools} public high schools in every county →
        </Link>
        {" · "}
        <Link href="/private-schools" className="text-brand-600 hover:underline">
          {stats.totalPrivateCharterSchools} private &amp; charter schools →
        </Link>
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <Link
            key={school.slug}
            href={`/schools/${school.slug}`}
            className="card overflow-hidden transition hover:shadow-md"
            style={{ borderTopWidth: 4, borderTopColor: school.colors.primary }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900">{school.name}</p>
                <p className="text-sm text-slate-500">{school.city}, AR</p>
              </div>
              <span className={`badge shrink-0 ${STATUS_COLORS[school.representationStatus]}`}>
                {STATUS_LABELS[school.representationStatus]}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{school.culture}</p>
            <p className="mt-2 text-xs text-slate-400 capitalize">
              {getInstitutionTypeLabel(school.type)} · {school.sector} · ~{school.enrollment.toLocaleString()} students
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
