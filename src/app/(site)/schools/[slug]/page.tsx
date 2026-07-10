import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getInstitutionBySlug,
  getCountyBySlug,
  INTERESTS,
  getInstitutionTypeLabel,
  STATUS_COLORS,
  STATUS_LABELS,
  PLATFORM_DISCLAIMER,
} from "@/lib/data";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getInstitutionBySlug(slug);
  if (!school) notFound();

  const county = getCountyBySlug(school.county);
  const primaryColor = school.colors.primary;

  return (
    <div>
      {/* Personalized header with school color inspiration */}
      <div
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/schools" className="text-sm text-white/80 hover:text-white">
            ← All schools
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`badge ${STATUS_COLORS[school.representationStatus]}`}>
              {STATUS_LABELS[school.representationStatus]}
            </span>
            {school.hbcu && <span className="badge bg-white/20 text-white">HBCU</span>}
            <span className="badge bg-white/20 text-white capitalize">{school.sector}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{school.name}</h1>
          <p className="mt-2 text-lg text-white/90">
            {school.city}, {county?.name ?? school.county} · Est. {school.founded}
          </p>
          <p className="mt-4 max-w-2xl text-white/80">
            Students connected to {school.shortName} are building their own civic network.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="card">
          <h2 className="text-lg font-bold text-slate-900">About {school.shortName}</h2>
          <p className="mt-2 text-slate-600">{school.culture}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-slate-500">Enrollment</p>
              <p className="font-semibold">~{school.enrollment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500">Founded</p>
              <p className="font-semibold">{school.founded}</p>
            </div>
            <div>
              <p className="text-slate-500">Type</p>
              <p className="font-semibold">{getInstitutionTypeLabel(school.type)} · {school.sector}</p>
            </div>
          </div>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-brand-600 hover:underline"
            >
              Official website →
            </a>
          )}
        </div>

        <div className="mt-6 card">
          <h2 className="text-lg font-bold text-slate-900">Join This Network</h2>
          <p className="mt-2 text-slate-600">
            Sign up, get your share link and QR code, and start recruiting students at {school.shortName}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <span key={i.id} className="badge bg-slate-100 text-slate-600">{i.label}</span>
            ))}
          </div>
          <button disabled className="mt-6 btn-primary cursor-not-allowed opacity-60">
            Sign Up — Launching July 14
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          {PLATFORM_DISCLAIMER} Connected to {school.name}. Not affiliated with or endorsed by {school.name}.
        </p>
      </div>
    </div>
  );
}
