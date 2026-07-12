import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPrivateCharterSchoolBySlug,
  getCountyBySlug,
  getInstitutionTypeLabel,
  INTERESTS,
  STATUS_COLORS,
  STATUS_LABELS,
  PLATFORM_DISCLAIMER,
} from "@/lib/data";
import { SignupButton } from "@/components/community/SignupButton";

export default async function PrivateCharterSchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getPrivateCharterSchoolBySlug(slug);
  if (!school) notFound();

  const county = getCountyBySlug(school.county);
  const primaryColor = school.colors.primary;

  return (
    <div>
      <div
        className="py-12 text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/private-schools" className="text-sm text-white/80 hover:text-white">
            ← All private &amp; charter schools
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={`badge ${STATUS_COLORS[school.representationStatus]}`}>
              {STATUS_LABELS[school.representationStatus]}
            </span>
            <span className="badge bg-white/20 text-white">{getInstitutionTypeLabel(school.type)}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{school.name}</h1>
          <p className="mt-2 text-lg text-white/90">
            {school.city}, {county?.name ?? school.county} · Grades {school.grades}
            {school.enrollment > 0 && ` · ${school.enrollment} students`}
          </p>
          <p className="mt-4 max-w-2xl text-white/80">
            Students at {school.shortName} can build their own civic network — connected locally, organizing statewide.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="card">
          <h2 className="text-lg font-bold text-slate-900">About {school.shortName}</h2>
          <p className="mt-2 text-slate-600">{school.culture}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-slate-500">County</p>
              <p className="font-semibold">
                {county ? (
                  <Link href={`/county/${county.slug}`} className="text-brand-600 hover:underline">
                    {county.name}
                  </Link>
                ) : (
                  school.county
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-500">{school.lea ? "School LEA" : "District LEA"}</p>
              <p className="font-semibold font-mono text-xs">{school.lea ?? school.districtLea}</p>
            </div>
            <div>
              <p className="text-slate-500">Type</p>
              <p className="font-semibold">{getInstitutionTypeLabel(school.type)}</p>
            </div>
          </div>
          {school.district && (
            <p className="mt-4 text-sm text-slate-500">
              District: <span className="font-medium text-slate-700">{school.district}</span>
            </p>
          )}
          {school.dataSource && (
            <p className="mt-4 text-xs text-slate-400">Source: {school.dataSource}</p>
          )}
        </div>

        <div className="mt-6 card">
          <h2 className="text-lg font-bold text-slate-900">Join This Network</h2>
          <p className="mt-2 text-slate-600">
            Sign up, get your share link and QR code, and start organizing at {school.shortName}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <span key={i.id} className="badge bg-slate-100 text-slate-600">{i.label}</span>
            ))}
          </div>
          <SignupButton county={school.county} school={school.slug} />
        </div>

        <p className="mt-6 text-xs text-slate-400">
          {PLATFORM_DISCLAIMER} Connected to {school.name}. Not affiliated with or endorsed by {school.name}.
        </p>
      </div>
    </div>
  );
}
